// Imports ====================================================================

import crypto       from 'node:crypto'
import url          from 'node:url'
import bcrypt       from 'bcrypt'
import UserAccount  from "./userAccounts.js"
import logging      from "logging"
import Config       from '../config.js'

let out: ReturnType<typeof logging.getScope>

const filename = url.fileURLToPath(import.meta.url)
const dirname  = url.fileURLToPath(new URL('.', import.meta.url))

// Types ======================================================================

export interface UserSessionEntry {
    /** Account username */
    username: string
    /** Unique, non-changing SHA256 ID assigned to the account owner. */
    userID: string
    /** Specifies whether the session belongs to a root user. */
    root: boolean
    /** Time of session's creation in ISO format. */
    createdISO: string
    /** Time of last session update or renewal in ISO format. */
    updatedISO: string
    /** 
     * Type of the session.  
     * Short sessions last a few hours, long sessions could last months, 
     * and elevated sessions only last for a few minutes, as they have root access.
     * 
     * For security, root sessions don't immediately have actual root privileges, 
     * the user must provide the password a second time to elevate it, after which 
     * it will quickly expire. This is to prevent unauthorized users from gaining
     * administrator access through the access of the administrator's device, where
     * he/she might have logged in using the long session option.
     */
    type: "short" | "long" | "elevated"
}

// Code =======================================================================

export default class UserSession {

    /** Stores user sessions in memory. */
    private static sessionCache = new Map<string, UserSessionEntry>()
    /** Session cleanup interval */
    private static sci = 10_000
    /** Session cleanup timer */
    private static declare sct: NodeJS.Timer
    /** Session ID byte size */
    public static sidLength = 64

    public static async open() {
        if (!out) out = logging.getScope(import.meta.url)
        this.sct = setInterval(() => {
            this._performCleanup()
        }, this.sci)
    }

    /** Retrieves a the user session object. */
    public static get(name: string) {
        return this.sessionCache.get(name)
    }

    /**
     * Validates user credentials, creates a new session and returns the new session ID.
     * @param name Account name
     * @param pass Password
     * @param long Session type
     */
    public static async create(name: string, pass: string, long: boolean): EavA<string, Error | 'WRONG_PASS_OR_NAME' | 'SID_GEN_ERROR'> {
        try {

            out.debug(`UserSession.create > name:${name} long:${long}`)
            
            const account = await UserAccount.get(name)
            if (!account) return ['WRONG_PASS_OR_NAME', null]

            const doPasswordsMatch = await bcrypt.compare(pass, account.password)
            if (!doPasswordsMatch) return ['WRONG_PASS_OR_NAME', null]

            const [SIDError, SID] = await this._getUniqueSID()
            if (SIDError) {
                out.error('UserSession.create > SID_GEN_ERROR:', SIDError)
                return ['SID_GEN_ERROR', null]
            }
            
            const created = new Date().toISOString()
            const session: UserSessionEntry = {
                username: account.username,
                userID: account.userID,
                root: account.root,
                createdISO: created,
                updatedISO: created,
                type: long ? 'long' : 'short'
            }

            this.sessionCache.set(SID, session)
            out.debug(`UserSession.create > Successful | name:${name} long:${long} userID:${session.userID}`)
            return [null, SID]

        } 
        catch (error) {
            return [error as Error, null]
        }
    }

    /**
     * Validates the user session, corresponding account password and elevates the session.
     * The session is given an "elevated" type and will be subject to quick expiry, due to
     * root permissions.
     * @param sid Session ID
     * @param pass Account password
     */
    public static async elevate(sid: string, pass: string) {
        try {

            out.notice(`UserSession.elevate() call made | SID:${sid.slice(0, 10)}...${sid.slice(-10)}`)
            
            const session = this.sessionCache.get(sid)
            if (!session) return 'ERR_UNKNOWN_SESSION'
            if (!session.root) return 'ERR_ROOT_REQUIRED'

            const account = await UserAccount.get(session.username)
            if (!account) return 'ERR_UNKNOWN_ACCOUNT' 
            if (account.userID !== session.userID) return 'ERR_UNKNOWN_ACCOUNT' // Mismatched username/account (heavy edge-case)

            const doPasswordsMatch = await bcrypt.compare(pass, account.password)
            if (!doPasswordsMatch) return "ERR_BAD_PASS"

            out.notice(`UserSession.elevate() call successful | SID:${sid.slice(0, 10)}...${sid.slice(-10)} user:${account.username}`)
            session.type = 'elevated'

        } 
        catch (error) {
            return error as Error
        }
    }

    /**
     * Validates whether SID corresponds to an existing session and extends its duration.
     * The session object is returned if successful and `undefined` if not.
     * @param sid Session ID
     * @returns boolean
     */
    public static renew(sid: string): UserSessionEntry | undefined {

        const session = this.sessionCache.get(sid)
        if (!session) return undefined

        session.updatedISO = new Date().toISOString()
        out.debug(`UserSession.renew successful | updated:${session.updatedISO} username:${session.username}`)
        return session

    }

    /**
     * Destroys the session corresponding to the given session ID and returns `boolean`
     * indicating whether the action was successful.
     * @param sid Session ID
     * @returns boolean
     */
    public static destroy(sid: string) {
        return this.sessionCache.delete(sid)
    }

    // Helper methods =========================================================

    /**
     * Generates a unique session ID.
     * @returns session ID
     */
    private static _getUniqueSID(): EavA<string> {
        return new Promise(resolve => {
            crypto.randomBytes(this.sidLength, async (error, bytes) => {

                // Catch cryptography errors, low system entropy, etc...
                if (error) {
                    out.error('_getUniqueSID error', error)
                    return resolve([error, null])
                }

                const SID = bytes.toString('base64')
                // Check if the session id is taken and generate a new one if true
                if (this.sessionCache.get(SID)) return resolve(await this._getUniqueSID())
                else resolve([null, SID])

            })
        })
    }

    /**
     * Performs a session cleanup by killing all expired user sessions.
     */
    private static async _performCleanup() {

        const now = Date.now()
        const sessionLengths: Record<UserSessionEntry["type"], number> = {
            short:    Config.$.sessions.shortDuration    * 1000*60,
            long:     Config.$.sessions.longDuration     * 1000*60*60*24,
            elevated: Config.$.sessions.elevatedDuration * 1000*60
        }

        for (const [SID, session] of this.sessionCache) {
            const sessionExpiryTime = new Date(session.updatedISO).getTime() + sessionLengths[session.type]
            const sessionExpired = now >= sessionExpiryTime

            if (sessionExpired) {
                this.sessionCache.delete(SID)
                const sessionLastedMs = Date.now() - new Date(session.createdISO).getTime()
                const sessionLasted = {
                    long: (sessionLastedMs / (1000*60*60*24)).toFixed(1) + ' days',
                    short: (sessionLastedMs / (1000*60*60)).toFixed(1) + ' hours',
                    elevated: (sessionLastedMs / (1000*60*60)).toFixed(1) + ' hours'
                }[session.type]
                out.info(`Session ${SID.slice(0, 10)}...${SID.slice(-10)} of "${session.username}/${session.userID}" expired, lasted ${sessionLasted}, elevated: ${session.type === 'elevated'}`)
            }
        }

    }
    


}
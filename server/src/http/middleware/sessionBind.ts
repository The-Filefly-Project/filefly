
// ============================================================================

import LoggerInstance from "logging"
import UserSession from "../../userdb/userSessions.js"
import type { TMiddleware } from "../server.js"

import z, { string } from "zod"

// ============================================================================

const ZSID = string().max(384)
export type SID = z.infer<typeof ZSID>

/**
 * Simply attaches the user session to the request object under `session` prop.
 */
export const sessionBind = (): TMiddleware => {

    const out = LoggerInstance.getScope(import.meta.url)
    
    return (req, res, next) => {
        try {
            const sid = req.cookies.sid
            const parseStatus = ZSID.safeParse(sid)
            if (parseStatus.success === false) return res.status(401).end()

            const session = UserSession.get(sid)
            // @ts-ignore
            req.session = session || null
            next()
        } 
        catch (error) {
            out.error(error as Error)
            res.status(500).end()
        }
    }

}

export default sessionBind
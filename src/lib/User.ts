// Imports ========================================================================================

import { createStore } from 'zustand'
import ClientError, { DepCode } from './Error'

// Types ==========================================================================================

import type { TSessionInfo } from '../../server/src/http/handlers/sessionInfo.get'
type UserSession = Partial<TSessionInfo>

// Module ==========================================================================================

export default class User {

    public static session = createStore<UserSession>()((set) => ({
        username: undefined,
        root: undefined,
        type: undefined,
        createdISO: undefined,
        updatedISO: undefined,
        setSession: (session: Required<UserSession>) => set(session)
    }))


    /**
     * Sends a login request. Returns `void` if successful and an error object if operation failed.
     * @param user username
     * @param pass password
     * @param long boolean - Whether to use a long session.
     * @returns Possible `Error` object containing the error code and HTTP response code.
     */
    public static async login(user: string, pass: string, long = false): EavSA<ClientError<{ statusCode: number }, 
        'USER_LOGIN_AUTH_ERROR' | 'USER_LOGIN_UNKNOWN_ERROR' | 'USER_BAD_REQUEST' | 'USER_SERVER_ERROR' | DepCode<typeof this.getSessionInfo>
    >> {
        try {
            const res = await fetch('/api/v1/session/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, pass, long })
            })
            if (res.status === 400) return new ClientError('USER_BAD_REQUEST',      'An error occurred while processing the request.', null, { statusCode: res.status }) 
            if (res.status === 401) return new ClientError('USER_LOGIN_AUTH_ERROR', 'Failed to log in due to server or auth error.',   null, { statusCode: res.status }) 
            if (res.status === 500) return new ClientError('USER_SERVER_ERROR',     'Server error.',                                   null, { statusCode: res.status })
            
            const infoError = await this.getSessionInfo()
            if (infoError) return infoError

        } 
        catch (error) {
            return new ClientError('USER_LOGIN_UNKNOWN_ERROR', "Failed to log in.", error as Error, { statusCode: -1 })
        }
    }


    /**
     * Sends a session renewal request. Returns `void` if successful and an error object if operation failed.
     * @returns Possible `Error` object containing the error code and HTTP response code.
     */
    public static async renewSession(): EavSA<ClientError<{ statusCode: number },
        'USER_RENEW_SESSION_ERROR' | 'USER_SERVER_ERROR' | 'USER_RENEW_UNKNOWN_ERROR' | DepCode<typeof this.getSessionInfo>
    >> {
        try {
            const res = await fetch('/api/v1/session/renew', { method: 'get' })
            if (res.status === 401) return new ClientError('USER_RENEW_SESSION_ERROR', 'Session expired.', null, { statusCode: res.status }) 
            if (res.status === 500) return new ClientError('USER_SERVER_ERROR',        'Server error.',    null, { statusCode: res.status }) 
                
            const infoError = await this.getSessionInfo()
            if (infoError) return infoError
        } 
        catch (error) {
            return new ClientError('USER_RENEW_UNKNOWN_ERROR', "Failed to log in.", error as Error, { statusCode: -1 })
        }
    }

    /**
     * Sends a session renew request and returns the possible error. The main session store is also updated if no errors
     * are encountered. If an error is returned, the session could not be renewed and a new one needs to be established.
     */
    private static async getSessionInfo(): EavSA<ClientError<{ statusCode: number },
        'USER_AUTH_ERROR' | 'USER_SERVER_ERROR' | 'USER_UNKNOWN_ERROR'
    >> {
        try {
            const res = await fetch('/api/v1/session/info', { method: 'get' })
            if (res.status === 401) return new ClientError('USER_AUTH_ERROR',   'Session expired.', null, { statusCode: res.status }) 
            if (res.status === 500) return new ClientError('USER_SERVER_ERROR', 'Server error.',    null, { statusCode: res.status })
            this.session.setState(await res.json())
        } 
        catch (error) {
            return new ClientError('USER_UNKNOWN_ERROR', 'Server error.', error as Error, { statusCode: -1 }) 
        }
    }



}
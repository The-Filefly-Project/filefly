
// ============================================================================

import LoggerInstance from "logging"
import UserSession from "../../userdb/userSessions.js"
import type { TMiddleware } from "../server.js"

// ============================================================================

/**
 * Simply attaches the user session to the request object under `session` prop 
 * and rejects the request with `401` code if the session is not valid.
 */
export const sessionBind = (): TMiddleware => {

    const out = LoggerInstance.getScope(import.meta.url)
    
    return (req, res, next) => {
        try {
            const sid = req.cookies.sid
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
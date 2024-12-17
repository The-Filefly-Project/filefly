// imports ==============================================================================

import { TRequestSetup } from "../server.js"
import UserSession, { UserSessionEntry } from "../../userdb/userSessions.js"
import logger from 'logging'

// Types ================================================================================

export type TSessionInfo = Pick<
    UserSessionEntry,
    'username' | 'root' | 'type' | 'createdISO' | 'updatedISO'
>
// Module ===============================================================================

const sessionRenew: TRequestSetup = () => {
    
    const out = logger.getScope(import.meta.url)
    out.debug('API handler setup.')

    return async function(req, res) {
        try {

            // Limit SID length
            const sid = req.cookies.sid
            const session = UserSession.get(sid)
    
            if (!session) return res.status(401).end()
            
            const info: TSessionInfo = {
                username:   session.username,
                root:       session.root,
                type:       session.type,
                createdISO: session.createdISO,
                updatedISO: session.updatedISO
            }
    
            res.json(info)
    
        }
        catch (error) {
            out.error(error as Error)
            res.status(500).end()
        }
    }

}

export default sessionRenew
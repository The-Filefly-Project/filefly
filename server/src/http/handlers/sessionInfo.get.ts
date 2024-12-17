// imports ==============================================================================

import { TRequestHandler, TRequestSetup } from "../server.js"
import { UserSessionEntry } from "../../userdb/userSessions.js"
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

    const renew: TRequestHandler = (req, res) => {
        try {

            const session = req.session
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

    return renew

}

export default sessionRenew
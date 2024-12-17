// imports ==============================================================================

import { TRequestSetup } from "../server.js"
import UserSession from "../../userdb/userSessions.js"
import logger from 'logging'

// Types ================================================================================

// Module ===============================================================================

const sessionRenew: TRequestSetup = () => {
    
    const out = logger.getScope(import.meta.url)
    out.debug('API handler setup.')

    return async function(req, res) {
        try {
            const session = UserSession.renew(req.cookies.sid)
            res.status(session ? 200 : 401).end()
        } 
        catch (error) {
            out.error(error as Error)
            res.status(500).end()
        }
    }

}

export default sessionRenew
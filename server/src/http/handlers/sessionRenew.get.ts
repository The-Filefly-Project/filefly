// imports ==============================================================================

import { TRequestSetup } from "../server.js"
import z, { string } from "zod"
import UserSession from "../../userdb/userSessions.js"
import logger from 'logging'

// Types ================================================================================

const ZSID = string().max(384)
export type SID = z.infer<typeof ZSID>

// Module ===============================================================================

const sessionRenew: TRequestSetup = () => {
    
    const out = logger.getScope(import.meta.url)
    out.debug('API handler setup.')

    return async function(req, res) {
        try {
    
            // Limit SID length
            const sid = req.cookies.sid
            const parseStatus = ZSID.safeParse(sid)
            if (parseStatus.success === false) {
                out.debug(`Bad request body:`, parseStatus)
                return res.status(400).end()
            }
            
            const session = UserSession.renew(sid)
            res.status(session ? 200 : 401).end()
    
        } 
        catch (error) {
            out.error(error as Error)
            res.status(500).end()
        }
    }

}

export default sessionRenew
// imports ==============================================================================

import { TRequestSetup } from "../server.js"
import logger from 'logging'

// Types ================================================================================

// Module ===============================================================================

const accountAvatar: TRequestSetup = () => {
    
    const out = logger.getScope(import.meta.url)
    out.debug('API handler setup.')

    return async function(_, res) {
        try {

            // todo: implement avatar upload/download per user account

            // temporary polyfill
            res.redirect('/images/user/default_avatar.png')
        }
        catch (error) {
            out.error(error as Error)
            res.status(500).end()
        }
    }

}

export default accountAvatar
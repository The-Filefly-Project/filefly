// imports ==============================================================================

import { TRequestSetup } from "../server.js"
import z, { string, boolean } from "zod"
import UserSession from "../../userdb/userSessions.js"
import Config from "../../config.js"
import logger from 'logging'

// Types ================================================================================

const ZRequestBody = z.object({
    user: string().max(256),
    pass: string().max(256),
    long: boolean()
})

export type TRequestBody = z.infer<typeof ZRequestBody>

// Module ===============================================================================

const sessionNew: TRequestSetup = () => {

    const out = logger.getScope(import.meta.url)
    out.debug('API handler setup.')

    return async function (req, res) {
        try {

            const parseStatus = ZRequestBody.safeParse(req.body)
            if (parseStatus.success === false) {
                out.debug(`Bad request body:`, parseStatus)
                return res.status(400).end()
            }

            const { user, pass, long } = req.body as TRequestBody
            const [createError, SID] = await UserSession.create(user, pass, long)
            
            if (createError) return createError === 'WRONG_PASS_OR_NAME'
                ? res.status(401).end()
                : res.status(500).end()

            res.cookie('sid', SID, {
                httpOnly: true,
                maxAge: long
                    ? Config.$.sessions.longDuration  * 1000 * 60 * 60 * 24
                    : Config.$.sessions.shortDuration * 1000 * 60,
            })
            .status(200)
            .end()

        }
        catch (error) {
            out.error(error as Error)
            res.status(500).end()
        }
    }

}

export default sessionNew

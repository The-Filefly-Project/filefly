// Imports ====================================================================

import url           from 'url'
import path          from 'path'
import http          from 'http'
import https         from 'https'
import express       from 'express'
import Config        from '../config.js'
import SSL           from './ssl/ssl.js'
import Logger        from 'logging'
import bodyParser    from 'body-parser'
import cookieParser  from 'cookie-parser'
import requestLogger from './middleware/requestLogger.js'

let out: ReturnType<typeof Logger.getScope>
const dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Types ======================================================================

export type TMiddleware     = (req: express.Request, res: express.Response, next: express.NextFunction) => any
export type TRequestHandler = (req: express.Request, res: express.Response) => any
export type TRequestSetup   = () => TRequestHandler

// Endpoints ==================================================================

// ==== SESSION ====
import sessionNew   from './handlers/sessionNew.post.js'
import sessionRenew from './handlers/sessionRenew.get.js'
import sessionInfo  from './handlers/sessionInfo.get.js'

// ===== ACCOUNT ====
import accountAvatar from './handlers/accountAvatar.get.js'

// Code =======================================================================

export default class HttpServer {

    public  static $: HttpServer
    private static app = express()
    private static server: http.Server | https.Server
    private static clientSPA = path.join(dirname, '../../../spa')

    public static start(): EavSA {
        return new Promise(async finish => {
            try {

                out = Logger.getScope(import.meta.url)
                
                if (Config.$.ssl.useEncryption) {
                    await SSL.init()
                    const [certError, sslData] = await SSL.getSSLCertKeyData()
                    if (certError) throw certError

                    const options: https.ServerOptions = { ...sslData }
                    this.server = https.createServer(options, this.app)

                    out.info(`Using HTTPS.`)
                }
                else {
                    this.server = http.createServer(this.app)
                    out.warn(`Using HTTP.`)
                }
                
                this.finishAPISetup()
        
                this.server.listen(Config.$.http.port, Config.$.http.host, () => {
                    out.info(`Listening on ${Config.$.http.host}:${Config.$.http.port}`)
                    finish(undefined)
                })

            } 
            catch (error) {
                finish(error as Error)
            }
        })
    }

    private static finishAPISetup() {

        // Only run static server in deployment, in development, Vite dev server proxy is used for the API access
        if (process.env.NODE_ENV === 'production') this.app.use(express.static(this.clientSPA))
        const router = express.Router({ mergeParams: false })

        this.app.use(bodyParser.json())
        this.app.use(cookieParser())
        this.app.use(requestLogger.logger)
        this.app.use('/api/v1', router)

        router.post('/session/new', sessionNew())
        router.get('/session/renew', sessionRenew())
        router.get('/session/info', sessionInfo())

        router.get('/account/avatar', accountAvatar())

        const staticRoot = path.join(dirname, '../../../spa')
        this.app.use(express.static(staticRoot, {
            dotfiles: 'ignore'
        }))


    }

}
// Imports ====================================================================

import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import c from 'chalk'
import Config from '../../config.js'
import Logger from 'logging'
import generateX509Cert, { X509Options } from './x509.js'

const dirname = url.fileURLToPath(new URL('.', import.meta.url))
let out: ReturnType<typeof Logger.getScope>

// Types ======================================================================

// Code =======================================================================

export default new class SSL {

    private certRegenInterval = 1

    private sslFolder   = path.join(dirname, '../../../crypto/')
    private timestamp   = path.join(this.sslFolder, 'timestamp')
    private certPem     = path.join(this.sslFolder, 'cert.pem')
    private pratekeyPem = path.join(this.sslFolder, 'privatekey.pem')

    public async init() {
        
        out = Logger.getScope(import.meta.url)

        out.debug(`SSL.init`)
        out.debug(`SSL.sslFolder > ${this.sslFolder}`)

        await fs.mkdir(this.sslFolder, { recursive: true })

        // Check .timestamp file and generate a new self-signed SSL certificate
        // if the old one is not there, is outdated or is near the end of its lifespan
        const generate = async () => {
            if (await this.shouldRegenerateCert()) {
                const timestamp = await this.getTimestamp()
                out.debug(
                    `SSL.init > timestamp valid until ${c.blue(timestamp ? new Date(timestamp) : "N/A")} ` +
                    `(${timestamp ? ('~'+((timestamp - Date.now()) / 86400000).toFixed(0)) : 0} days)`
                )
                await this.generateSSLCert()
            }
        }

        // Initialize certificate and check it periodically
        if (Config.$.ssl.certificateSource === 'self-signed' && Config.$.ssl.useEncryption) {
            await generate()
            setInterval(() => generate(), this.certRegenInterval * 1000*60*60*24)
        }

    }

    public async generateSSLCert(): EavSA {
        try {

            const src = Config.$.ssl.selfSigned
            const config: X509Options = {
                days:             src.lifetimeDays,
                alg:              src.algorithm,
                keySize:          src.keySize,
                commonName:       src.commonName,
                countryName:      src.countryName,
                localityName:     src.localityName,
                organizationName: src.organizationName
            }

            out.warn('SSL.generateSSLCert > getting new ssl cert/key pair')
            out.debug(`SSL.generateSSLCert > config`, JSON.stringify(config))

            const ssl = await generateX509Cert(config)

            out.debug(`SSL.generateSSLCert > writing SSL cert - ${c.blue(this.certPem)}`)
            await fs.writeFile(this.certPem, ssl.cert)

            out.debug(`SSL.generateSSLCert > writing private key - ${c.blue(this.pratekeyPem)}`)
            await fs.writeFile(this.pratekeyPem, ssl.privateKey)
            
            // Update .timestamp file
            const validUntil = await this.setTimestamp()

            out.notice('SSL.generateSSLCert > finished successfully')
            out.notice(
                `New SSL certificate valid until ${c.blue(new Date(validUntil))}. Alg: ${config.alg}, key size: ${config.keySize}. ` +
                `(${((validUntil - Date.now()) / 86400000).toFixed(0)} days)`
            )
            
        } 
        catch (error) {
            return error as Error
        }
    }

    public async getSSLCertKeyData(): EavA<{ cert: string, key: string }> {
        try {
            if (Config.$.ssl.certificateSource === 'external') {
                out.info('Using external SSL certificate')
                return [null, {
                    cert: await fs.readFile(Config.$.ssl.external.certificate!, 'utf-8'),
                    key: await fs.readFile(Config.$.ssl.external.privateKey!, 'utf-8')
                }]
            }
            else {
                out.warn('Using self-signed SSL certificate')
                return [null, {
                    cert: await fs.readFile(this.certPem, 'utf-8'),
                    key: await fs.readFile(this.pratekeyPem, 'utf-8')
                }]
            }
        } 
        catch (error) {
            return [error as Error, null]
        }
    }

    // Utilities ==============================================================

    private async shouldRegenerateCert() {
        if (Config.$.ssl.certificateSource === 'self-signed') {
            const timestamp = await this.getTimestamp()
            // No .timestamp = no SSL certificate
            if (timestamp === undefined) return true
            // .timestamp expired or soon to expire
            if ((timestamp - Date.now()) < (Config.$.ssl.selfSigned.advancePregegen * 24*60*60*1000)) return true
            // Within expire threshold
            return false
        }
        else {
            return false
        }
    }

    private async getTimestamp() {
        try {
            const content = await fs.readFile(this.timestamp, 'utf-8')
            return parseInt(content)
        }
        catch {
            return undefined
        }
    }

    private async setTimestamp() {
        const now = Date.now() + Config.$.ssl.selfSigned.lifetimeDays * 1000 * 60 * 60 * 24
        await fs.writeFile(this.timestamp, now.toString())
        return now
    }

}


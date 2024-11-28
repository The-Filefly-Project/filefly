
// ============================================================================

import forge from 'node-forge'

// ============================================================================

function toPositiveHex(hex: string) {
    let mostSignificantHexAsInt = parseInt(hex[0], 16)
    if (mostSignificantHexAsInt < 8) return hex

    mostSignificantHexAsInt -= 8
    return mostSignificantHexAsInt.toString() + hex.substring(1)
}

export interface X509Options {
    /** Certificate validity duration */
    days: number
    /** Certificate/key size in bits */
    keySize: number
    /** Digest algorithm */
    alg: 'sha256' | 'sha384' | 'sha512'

    commonName: string
    countryName: string
    localityName: string
    organizationName: string
}

export default async function generateX509Cert(options: X509Options) {

    const cert = forge.pki.createCertificate()
    const keyPair = forge.pki.rsa.generateKeyPair(options.keySize)

    cert.serialNumber = toPositiveHex(forge.util.bytesToHex(forge.random.getBytesSync(9)))
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + options.days)

    const certAttributes = [
        { name: 'commonName',       value: options.commonName       }, 
        { name: 'countryName',      value: options.countryName      }, 
        { name: 'localityName',     value: options.localityName     }, 
        { name: 'organizationName', value: options.organizationName },
    ]

    cert.setSubject(certAttributes)
    cert.setIssuer(certAttributes)
    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: true
        },
        {
            name: 'keyUsage',
            keyCertSign: true,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true
        }
    ])

    // Add the public key and sign the certificate
    cert.publicKey = keyPair.publicKey
    cert.sign(keyPair.privateKey, forge.md[options.alg].create())

    return {
        cert:       forge.pki.certificateToPem(cert),
        privateKey: forge.pki.privateKeyToPem(keyPair.privateKey)
    }

}

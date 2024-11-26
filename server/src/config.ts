// Imports ========================================================================================

import fs   from 'node:fs/promises'
import path from 'node:path'
import url  from 'node:url'
import yaml from 'js-yaml'
import c    from 'chalk'
import z, { object, string, number, boolean, literal, union } from 'zod'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

// Types ==========================================================================================

const ZLogLevel = union([
    literal('crit'),
    literal('error'),
    literal('warn'),
    literal('notice'),
    literal('info'),
    literal('http'),
    literal('debug')
])

const ZConfig = object({
    logging: object({
        consoleLogLevel: ZLogLevel,
        fileLogLevel:    ZLogLevel,
        maxFileSize:     union([ number(), string() ]),
        maxFiles:        union([ number(), string() ])
    })
})

type TConfig = z.infer<typeof ZConfig>

// Module =========================================================================================

export default class Config {

    public static declare $: TConfig
    public static yamlFile = path.join(dirname, '../../server.config.yaml')

    public static async load(): Promise<ConfigParseError | void> {
        try {
            const content = await fs.readFile(this.yamlFile, 'utf-8')
            const config  = yaml.load(content) as TConfig
            const result  = ZConfig.safeParse(config)

            this.$ = config

            if (!result.success) {
                throw result.error.issues.map(x => {
                    return `<${x.path}> (${x.code}) Error: ${x.message}`
                })
            }
        } 
        catch (error) {
            return new ConfigParseError(error as Error) 
        }

    }

}

class ConfigParseError extends Error {

    public configurationFile = Config.yamlFile

    constructor(parseError: Error) {
        super()
        this.name = c.red(this.constructor.name)
        this.message = parseError.message || c.red(`An error was encountered while parsing server configuration.`)
        Error.captureStackTrace(this)

        if (Array.isArray(parseError)) {
            this.message += '\n    > ' +
            parseError.map(x => c.yellow(x))
                .join('\n    > ')
        }

    }

}



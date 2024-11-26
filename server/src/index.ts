// Imports ========================================================================================

import path             from 'node:path'
import url              from 'node:url'
import LoggerInstance   from "logging"
import Util             from "./util.js"
import Config           from "./config.js"

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

// Main ===========================================================================================

;(async function main() {
    try {

        // Config
        const e1 = await Config.load()
        if (e1) throw e1
        
        // Logging
        const e2 = await LoggerInstance.init({
            where: path.join(dirname, '../logs'),
            consoleLogLevel: Config.$.logging.consoleLogLevel,
            fileLogLevel: Config.$.logging.fileLogLevel,
            maxLogFileSize: Config.$.logging.maxFileSize,
            maxLogFileCount: Config.$.logging.maxFiles,
            dirname: dirname
        })
        if (e2) throw e2
        
        LoggerInstance.getScope(import.meta.url)
            .info('Finished initialization.')

    } 
    catch (error) {
        Util.silence(() => LoggerInstance.getScope(import.meta.url).crit(error as Error))
        throw error
    }
})()
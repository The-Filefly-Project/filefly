// Imports ========================================================================================

/// <reference types="../../helpers.d.ts"/>

import path             from 'node:path'
import url              from 'node:url'
import LoggerInstance   from "logging"
import Util             from "./util.js"
import Config           from "./config.js"
import UserAccounts     from './userdb/userAccounts.js'
import HttpServer       from "./http/server.js"
import UserSession from './userdb/userSessions.js'

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
            dirname: path.join(dirname, '../../'),
            stackDepth: 3
        })
        if (e2) throw e2
 
        // User accounts database
        const e3 = await UserAccounts.open()
        if (e3) throw e3

        // User accounts database
        const e4 = await UserSession.open()
        if (e4) throw e4

        // HTTP server
        const e5 = await HttpServer.start()
        if (e5) throw e5
        
        LoggerInstance.getScope(import.meta.url)
            .info('Finished initialization.')

    } 
    catch (error) {
        const failedToLog = Util.muffle(() => LoggerInstance.getScope(import.meta.url).crit(error as Error))
        if (failedToLog) throw error
        process.exit(1)
    }
})()
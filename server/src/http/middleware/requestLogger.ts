
// ============================================================================

import c from "chalk"
import Logger from 'logging'

import type { Request, Response, NextFunction } from "express"
import type { TMiddleware } from "../server.js"

let out: ReturnType<typeof Logger.getScope>

// ============================================================================

export default class RequestLogger {

    private static currentID = 0

    private static getRequestID() {
        const id = (this.currentID++).toString(16).padStart(5, '0')
        if (id === 'fffff') this.currentID = 0
        return c.grey(id)
    }

    private static getStatusCodeColor(code: number) {
        if (code <= 199) return c.blue(code)
        if (code <= 299) return c.green(code)
        if (code <= 399) return c.cyan(code)
        if (code <= 599) return c.red(code)
    }

    public static logger = ((req: Request, res: Response, next: NextFunction) => {

        out = Logger.getScope(import.meta.url)

        const id = this.getRequestID()
        const method = c.green(req.method)
        const ip = c.grey(req.ip)
        const url = req.originalUrl
        const start = Date.now()
        const blankStatus = c.grey('###')
        const blankTime = c.grey("*****")
        const reqSign = c.grey('req')
        const resSign = c.whiteBright('res')
    
        out.http(`${id} ${reqSign} ${method} ${blankStatus} ${ip} ${blankTime} ${url}`)
        res.on('finish', () => out.http(`${id} ${resSign} ${method} ${this.getStatusCodeColor(res.statusCode)} ${ip} ${c.whiteBright(Date.now()-start+'ms').padEnd(5)} ${url}`))
    
        next()
    
    }) satisfies TMiddleware


}

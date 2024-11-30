// Types ======================================================================

type ErrorMetadata = { [value: string]: any }

/** Extracts possible error codes emitted by methods called from within other methods */
export type DepCode<Method extends () => any> = Extract<Awaited<ReturnType<Method>>, ClientError>['code']

// Code =======================================================================

export default class ClientError<
    ErrorMeta extends ErrorMetadata = ErrorMetadata,
    ErrorCode extends string = string
> 
extends Error {

    public code: ErrorCode
    public message: string
    public trace: (Error | ClientError)[] = []
    public meta: ErrorMeta

    constructor(code: ErrorCode, message: string, cause?: Error | null, meta?: ErrorMeta) {
        super(message)
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor)
        this.code = code
        this.message = message
        this.meta = meta || {} as Record<any, any>
        if (cause) {
            if (cause instanceof ClientError) {
                this.trace = [cause, ...cause.trace]
                cause.trace = []
            }
            else {
                this.trace.unshift(cause)
            }
        }
    }

}
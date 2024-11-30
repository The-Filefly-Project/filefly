/**
 * GO-like error-as-value return type. Used specifically to avoid
 * throwing errors which generally produce messy control flow.
 */
declare type Eav<V, E = Error> = [E, null] | [null, V]

/**
 * Async implementation of `Eav<value, error>`
 */
declare type EavA<V, E = Error> = Promise<Eav<V, E>>

/**
 * Single-value function return type.
 */
declare type EavS<E = Error> = E | void

/**
 * Async implementation of `EavS<error>`.
 */
declare type EavSA<E = Error> = Promise<EavS<E>>

/**s
 * Extracts enum values.
 */
declare type Values<T> = T[keyof T]

/**
 * Makes selected keys optional.
 */
declare type Optional<O, K extends keyof O> = Omit<O, K> & Partial<Pick<O, K>>

/** Describes some levelDB error objects. */
declare type LevelGetError = {
    code: string
    notFound: boolean
    status: number
}

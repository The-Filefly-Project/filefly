import Router from 'hopper'

export default class Routing {

    public static router = new Router()
    private static initialized = false

    public static init() {
        if (!this.initialized) {
            this.router.startListening()
            this.initialized = true
        }
    }

}

import Router from 'hopper'

export default class Routing {

    public static router: Router

    public static init() {
        this.router = new Router()
        console.log(Router)
        this.router.startListening()
        this.router.set(window.location.hash)
    }


}
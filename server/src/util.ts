export default class Util {

    /** Runs the callback and silences possible errors. */
    public static silence(callback: Function) {
        try { callback() } 
        catch {}
    }

}
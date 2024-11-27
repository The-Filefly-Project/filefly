export default class Util {

    /** Runs the callback and silences possible errors. */
    public static silence(callback: () => any) {
        try { callback() } 
        catch { /* empty */ }
    }

}
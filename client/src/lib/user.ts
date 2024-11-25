import { defineStore } from "pinia"

interface UserSession {
    username: string | null
    sessionID: string | null
    loginError: Error | null
}

export const useSessionStore = defineStore<'user', UserSession>('user', {

    state: () => ({
        username: null,
        sessionID: null,
        loginError: null
    }),

    actions: {

        login: async (name: string, password: string, long: boolean = false) => {
            console.log(name, password, long)
        },

    }

})
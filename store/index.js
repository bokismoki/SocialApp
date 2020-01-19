export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
    nuxtServerInit({ state }, { $axios }) {
        if (state.auth.loggedIn) {
            $axios
                .post('/user/login', state.auth.user, {
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
}
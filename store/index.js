export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
    nuxtServerInit({ state }, { $axios, $cookies }) {
        if (state.auth.loggedIn) {
            $axios
                .post('/user/login', state.auth.user, {
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then(response => {
                    if (response.data.success === true) {
                        $axios.post('/user/token', { user_id: state.auth.user.id }, {
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                            .then(response => {
                                const token = response.headers['set-cookie'][0].split('=')[1].split(';')[0]
                                this.$cookies.set('jwt', token)
                            })
                            .catch(err => {
                                console.error(err)
                            })
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }
}
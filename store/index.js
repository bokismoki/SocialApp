export const state = () => ({
    errorMsg: '',
    isLoading: false,
    isDropdownMenuOpen: false,
    hasNotifications: false
})

export const getters = {
    errorMsg: state => state.errorMsg,
    isLoading: state => state.isLoading,
    isDropdownMenuOpen: state => state.isDropdownMenuOpen,
    hasNotifications: state => state.hasNotifications
}

export const mutations = {
    SET_ERROR_MSG: (state, payload) => {
        state.errorMsg = payload
    },
    SET_IS_LOADING: (state, payload) => {
        state.isLoading = payload
    },
    SET_IS_DROPDOWN_MENU_OPEN: (state, payload) => {
        state.isDropdownMenuOpen = payload
    },
    SET_HAS_NOTIFICATIONS: (state, payload) => {
        state.hasNotifications = payload
    }
}

export const actions = {
    nuxtServerInit({ state }, { app, $axios }) {
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
                                app.$cookies.set('jwt', token)
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
    },
    setErrorMsg: ({ commit }, payload = '') => {
        commit('SET_ERROR_MSG', payload)
        setTimeout(() => {
            commit('SET_ERROR_MSG', '')
        }, 4000)
    },
    setIsLoading: ({ commit }, payload) => {
        commit('SET_IS_LOADING', payload)
    },
    setIsDropdownMenuOpen: ({ commit }, payload) => {
        commit('SET_IS_DROPDOWN_MENU_OPEN', payload)
    },
    setHasNotifications: ({ commit }, payload) => {
        commit('SET_HAS_NOTIFICATIONS', payload)
    }
}
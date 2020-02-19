export const state = () => ({
    errorMsg: '',
    isLoading: false,
    isDropdownMenuOpen: false,
    hasNotifications: false,
    onlineUsers: [],
    messageNotifications: []
})

export const getters = {
    errorMsg: state => state.errorMsg,
    isLoading: state => state.isLoading,
    isDropdownMenuOpen: state => state.isDropdownMenuOpen,
    hasNotifications: state => state.hasNotifications,
    onlineUsers: state => state.onlineUsers,
    hasMessages: state => Boolean(state.messageNotifications.length),
    messageNotifications: state => state.messageNotifications
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
    },
    SET_ONLINE_USERS: (state, payload) => {
        state.onlineUsers = payload
    },
    SPLICE_ONLINE_USERS: (state, payload) => {
        state.onlineUsers.splice(payload, 1)
    },
    SET_MESSAGE_NOTIFICATIONS: (state, payload) => {
        state.messageNotifications = payload
    }
}

export const actions = {
    nuxtServerInit({ state, dispatch }, { app, $axios }) {
        if (state.auth.loggedIn) {
            $axios.get(`/notification/get/count/${state.auth.user.id ? state.auth.user.id : state.auth.user.sub}`)
                .then(response => {
                    const hasNotifications = response.data.hasNotifications
                    dispatch('setHasNotifications', hasNotifications)
                }).catch(err => {
                    console.error(err)
                })

            $axios.get(`/message/get/unread/${state.auth.user.id ? state.auth.user.id : state.auth.user.sub}`)
                .then(response => {
                    dispatch('setMessageNotifications', response.data.messages)
                }).catch(err => {
                    console.error(err)
                })


            if (state.auth.strategy === 'facebook') {
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
            } else {
                const user = {
                    name: state.auth.user.name,
                    picture: {
                        data: {
                            url: state.auth.user.picture
                        }
                    },
                    email: state.auth.user.email,
                    id: state.auth.user.sub
                }
                $axios
                    .post('/user/login', user, {
                        headers: {
                            'content-type': 'application/json'
                        }
                    })
                    .then(response => {
                        if (response.data.success === true) {
                            $axios.post('/user/token', { user_id: state.auth.user.sub }, {
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
    },
    setOnlineUsers: ({ commit }, payload) => {
        commit('SET_ONLINE_USERS', payload)
    },
    spliceOnlineUsers: ({ commit }, payload) => {
        commit('SPLICE_ONLINE_USERS', payload)
    },
    setMessageNotifications: ({ commit }, payload) => {
        commit('SET_MESSAGE_NOTIFICATIONS', payload)
    }
}
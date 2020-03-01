export const state = () => ({
    errorMsg: '',
    isLoading: false,
    isDropdownMenuOpen: false,
    hasNotifications: false,
    onlineUsers: [],
    messageNotifications: [],
    imageSrc: ''
})

export const getters = {
    errorMsg: state => state.errorMsg,
    isLoading: state => state.isLoading,
    isDropdownMenuOpen: state => state.isDropdownMenuOpen,
    hasNotifications: state => state.hasNotifications,
    onlineUsers: state => state.onlineUsers,
    hasMessages: state => Boolean(state.messageNotifications.length),
    messageNotifications: state => state.messageNotifications,
    imageSrc: state => state.imageSrc
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
    },
    REMOVE_MESSAGE_NOTIFICATION: (state, payload) => {
        state.messageNotifications.splice(payload, 1)
    },
    ADD_MESSAGE_NOTIFICATION: (state, payload) => {
        state.messageNotifications.push(payload)
    },
    SET_IMAGE_SRC: (state, payload) => {
        state.imageSrc = payload
    }
}

export const actions = {
    async nuxtServerInit({ state, dispatch }, { app, $axios }) {
        try {
            if (state.auth.loggedIn) {
                const hasNotificationsData = await $axios.get(`/notification/get/count/${state.auth.user.id ? state.auth.user.id : state.auth.user.sub}`)
                const hasNotifications = hasNotificationsData.data.hasNotifications
                dispatch('setHasNotifications', hasNotifications)

                const messages = await $axios.get(`/message/get/unread/${state.auth.user.id ? state.auth.user.id : state.auth.user.sub}`)
                dispatch('setMessageNotifications', messages.data.messages)

                if (state.auth.strategy === 'facebook') {
                    const login = await $axios
                        .post('/user/login', state.auth.user, {
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                    if (login.data.success === true) {
                        const tokenData = await $axios.post('/user/token', { user_id: state.auth.user.id }, {
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                        const token = tokenData.headers['set-cookie'][0].split('=')[1].split(';')[0]
                        app.$cookies.set('jwt', token)
                    }
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
                    const login = await $axios
                        .post('/user/login', user, {
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                    if (login.data.success === true) {
                        const tokenData = await $axios.post('/user/token', { user_id: state.auth.user.sub }, {
                            headers: {
                                'content-type': 'application/json'
                            }
                        })
                        const token = tokenData.headers['set-cookie'][0].split('=')[1].split(';')[0]
                        app.$cookies.set('jwt', token)
                    }
                }
            }
        } catch (err) {
            console.error(err)
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
    },
    removeMessageNotification: ({ getters, commit }, payload) => {
        const index = getters.messageNotifications.findIndex(msg => msg.user_id === payload)
        commit('REMOVE_MESSAGE_NOTIFICATION', index)
    },
    addMessageNotification: ({ getters, commit }, payload) => {
        const doesExist = getters.messageNotifications.find(msg => msg.user_id === payload.user_id)
        if (!doesExist) {
            commit('ADD_MESSAGE_NOTIFICATION', payload)
        }
    },
    setImageSrc: ({ commit }, payload) => {
        commit('SET_IMAGE_SRC', payload)
    }
}
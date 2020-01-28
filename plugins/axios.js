export default function ({ $axios, $auth, store, app, redirect }) {
    $axios.onError(error => {
        if (error) {
            if (error.response.status === 401) {
                store.dispatch('setErrorMsg', 'Authorization Error...logging out')
                $auth.logout()
                app.$cookies.remove('jwt')
                redirect({ name: 'login' })
            }
        }
    })
}
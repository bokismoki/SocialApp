export default function ({ $axios, $auth }) {
    $axios.onError(error => {
        if (error.response.status === 401) {
            $auth.logout()
        }
    })
}
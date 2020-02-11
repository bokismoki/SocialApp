export default async ({ $axios, $auth, store, route }) => {
    if ($auth.loggedIn) {
        const hasNotifications = await $axios.get(`/notification/get/count/${$auth.user.id ? $auth.user.id : $auth.user.sub}`)
        store.dispatch('setHasNotifications', hasNotifications.data.hasNotifications)
    }
}
export default async ({ $axios, $auth, store, route }) => {
    if ($auth.loggedIn) {
        const hasNotifications = await $axios.get(`/notification/get/count/${$auth.user.id}`)
        store.dispatch('setHasNotifications', hasNotifications.data.hasNotifications)
    }
}
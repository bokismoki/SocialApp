<template>
  <div class="notifications">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Notifications</h1>
      <button class="mb-3 py-1 font-semibold bg-blue-600 text-sm text-white rounded px-2">Mark ALL as seen</button>
      <div>
        <div v-for="notification in notifications" :key="notification.notification_id">
          <NotificationItem :notification="notification" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Notifications'
  },
  middleware: 'auth',
  components: {
    NotificationItem: () => import('~/components/NotificationItem')
  },
  async asyncData({ $axios, $auth, store }) {
    try {
      store.dispatch('setIsLoading', true)
      const notifications = await $axios.get(
        `/notification/get/by_user/${$auth.user.id}`
      )
      store.dispatch('setIsLoading', false)
      return {
        notifications: notifications.data.notifications
      }
    } catch (err) {
      store.dispatch('setErrorMsg', err)
      store.dispatch('setIsLoading', false)
    }
  }
}
</script>

<style scoped>
.notifications {
  margin-top: 80px;
}
</style>
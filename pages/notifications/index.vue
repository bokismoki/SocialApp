<template>
  <div class="notifications">
    <div class="container mx-auto pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Notifications</h1>
      <button
        v-if="notifications.length > 0"
        class="mb-3 py-1 font-semibold bg-blue-600 text-sm text-white rounded px-2"
        @click="deleteAllNotifications"
      >Mark ALL as seen</button>
      <h1 v-if="notifications.length === 0">No new notifications to display</h1>
      <div v-else>
        <div v-for="(notification, index) in notifications" :key="notification.notification_id">
          <NotificationItem
            :notification="notification"
            :index="index"
            @deleteNotification="deleteNotification"
          />
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
  methods: {
    deleteNotification(payload) {
      this.notifications.splice(payload, 1)
      if (this.notifications.length === 0) {
        this.$store.dispatch('setHasNotifications', false)
      }
    },
    deleteAllNotifications() {
      this.$store.dispatch('setIsLoading', true)
      this.$axios
        .delete(`/notification/delete_all/${this.$auth.user.id}`, {
          data: {
            user_id: this.$auth.user.id
          }
        })
        .then(response => {
          if (response.data.success) {
            this.notifications = []
            this.$store.dispatch('setHasNotifications', false)
          }
          this.$store.dispatch('setIsLoading', false)
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('setIsLoading', false)
        })
    }
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
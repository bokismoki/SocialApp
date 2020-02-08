<template>
  <div class="notification_item">
    <div class="flex items-center mb-2">
      <nuxt-link :to="{name: 'profile-id', params: {id: notification.user_id}}">
        <img
          class="rounded-full w-8 h-8 mr-2 border-2 border-blue-300"
          :src="notification.image"
          alt="Facebook profile image"
        />
      </nuxt-link>
      <span class="text-sm leading-none" v-if="notification.type === 'follow'">
        {{notification.name}}
        <span class="text-blue-700 font-semibold">followed</span> you
        <button
          class="block mt-1 py-1 text-xs font-semibold bg-blue-600 text-white rounded px-2"
          @click="deleteNotification"
        >Mark as seen</button>
      </span>
      <span class="text-sm leading-none" v-else-if="notification.type === 'like'">
        {{notification.name}}
        <span class="text-blue-700 font-semibold">liked</span> your
        <nuxt-link
          class="text-blue-700 font-semibold underline"
          :to="{name: 'post-id', params: {id: notification.post_id}}"
        >post</nuxt-link>
        <button
          class="block mt-1 py-1 text-xs font-semibold bg-blue-600 text-white rounded px-2"
          @click="deleteNotification"
        >Mark as seen</button>
      </span>
      <span class="text-sm leading-none" v-else>
        {{notification.name}}
        <span class="text-blue-700 font-semibold">commented</span> on your
        <nuxt-link
          class="text-blue-700 font-semibold underline"
          :to="{name: 'post-id', params: {id: notification.post_id}}"
        >post</nuxt-link>
        <button
          class="block mt-1 py-1 text-xs font-semibold bg-blue-600 text-white rounded px-2"
          @click="deleteNotification"
        >Mark as seen</button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationItem',
  props: ['notification', 'index'],
  methods: {
    deleteNotification() {
      this.$store.dispatch('setIsLoading', true)
      this.$axios
        .delete(`/notification/delete/${this.notification.notification_id}`, {
          data: {
            user_id: this.$auth.user.id
          }
        })
        .then(response => {
          if (response.data.success) {
            this.$emit('deleteNotification', this.index)
          }
          this.$store.dispatch('setIsLoading', false)
        })
        .catch(err => {
          console.error(err)
          this.$store.dispatch('setIsLoading', false)
        })
    }
  }
}
</script>

<style scoped>
</style>
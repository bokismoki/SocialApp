<template>
  <ul class="dropdown_menu">
    <li class="mb-1 p-2 bg-blue-700">
      <nuxt-link class="flex items-center" :to="{name: 'index'}">
        <div class="flex items-center">
          <img
            class="w-8 mr-5"
            src="~/assets/img/posts.svg"
            alt="White paper icon representing posts"
          />
          <span class="text-white uppercase">Home</span>
        </div>
      </nuxt-link>
    </li>
    <li class="mb-1 p-2 bg-blue-700">
      <nuxt-link class="flex items-center" :to="{name: 'notifications'}">
        <div class="flex items-center">
          <div class="relative mr-5">
            <img
              class="w-8"
              src="~/assets/img/bell.svg"
              alt="White bell icon representing notifications"
            />
            <div v-if="hasNotifications">
              <NotificationsIndicator />
            </div>
          </div>
          <span class="text-white uppercase">Notifications</span>
        </div>
      </nuxt-link>
    </li>
    <li class="mb-1 p-2 bg-blue-700">
      <nuxt-link class="flex items-center" :to="{name: 'chat'}">
        <div class="flex items-center">
          <div class="relative mr-5">
            <img
              class="w-8"
              src="~/assets/img/chat.svg"
              alt="White dialog blocks icon representing chat"
            />
            <div v-if="hasMessages">
              <NotificationsIndicator />
            </div>
          </div>
          <span class="text-white uppercase">Chat</span>
        </div>
      </nuxt-link>
    </li>
    <li class="mb-1 p-2 bg-blue-700">
      <nuxt-link class="flex items-center" :to="{name: 'profile'}">
        <div class="flex items-center">
          <img class="w-8 mr-5" src="~/assets/img/profile.svg" alt="White user silhouette icon" />
          <span class="text-white uppercase">Profile</span>
        </div>
      </nuxt-link>
    </li>
    <li class="mb-1 p-2 bg-blue-700">
      <nuxt-link :to="{name: 'settings'}">
        <div class="flex items-center">
          <img
            class="w-8 mr-5"
            src="~/assets/img/settings.svg"
            alt="White tools icon representing settings"
          />
          <span class="text-white uppercase">Settings</span>
        </div>
      </nuxt-link>
    </li>
    <li class="p-2 bg-blue-700">
      <div @click="$emit('logout')" class="flex items-center cursor-pointer opacity-50">
        <img class="w-8 mr-5" src="~/assets/img/logout.svg" alt="White logout icon" />
        <span class="text-white uppercase">Logout</span>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DropdownMenu',
  components: {
    NotificationsIndicator: () => import('~/components/NotificationsIndicator')
  },
  computed: {
    ...mapGetters(['hasNotifications', 'hasMessages'])
  }
}
</script>

<style scoped>
</style>
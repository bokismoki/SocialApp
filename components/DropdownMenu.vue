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
      <div class="flex items-center cursor-pointer">
        <img class="w-8 mr-5" src="~/assets/img/logout.svg" alt="White logout icon" />
        <span class="text-white uppercase">Logout</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'DropdownMenu'
}
</script>

<style scoped>
</style>
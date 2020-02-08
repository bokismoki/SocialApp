<template>
  <nav class="navbar fixed top-0 w-full bg-blue-800 z-50 shadow-nav">
    <div class="flex items-center justify-between container mx-auto p-5 text-white">
      <nuxt-link :to="{name: 'index'}">
        <div class="flex items-center">
          <div>
            <img class="w-10 mr-2" src="~/assets/img/logo.svg" alt="White bell logo" />
          </div>
          <h1 class="uppercase text-2xl">Social App</h1>
        </div>
      </nuxt-link>
      <div v-if="!$auth.loggedIn">
        <nuxt-link :to="{name: 'login'}">
          <div class="flex items-center">
            <img class="w-8 lg:mr-2" src="~/assets/img/login.svg" alt="White login icon" />
            <span class="hidden lg:inline text-sm uppercase">Login</span>
          </div>
        </nuxt-link>
      </div>
      <div v-else>
        <img
          v-if="isDropdownMenuOpen"
          class="w-10 cursor-pointer sm:hidden"
          src="~/assets/img/cross.svg"
          alt="White cross icon"
          @click="setIsDropdownMenuOpen"
        />
        <img
          v-else
          class="w-10 cursor-pointer sm:hidden"
          src="~/assets/img/hamburger.svg"
          alt="White hamburger menu icon"
          @click="setIsDropdownMenuOpen"
        />
      </div>
      <div v-if="$auth.loggedIn" class="hidden sm:flex items-center">
        <div class="lg:mr-10">
          <nuxt-link :to="{name: 'index'}">
            <div class="flex items-center">
              <img
                class="w-8 mr-5 lg:mr-2"
                src="~/assets/img/posts.svg"
                alt="White paper icon representing posts"
              />
              <span class="hidden lg:inline text-sm uppercase">Home</span>
            </div>
          </nuxt-link>
        </div>
        <div class="lg:mr-10">
          <nuxt-link :to="{name: 'profile'}">
            <div class="flex items-center">
              <img
                class="w-8 mr-5 lg:mr-2"
                src="~/assets/img/profile.svg"
                alt="White user silhouette icon"
              />
              <span class="hidden lg:inline text-sm uppercase">Profile</span>
            </div>
          </nuxt-link>
        </div>
        <div class="lg:mr-10">
          <nuxt-link :to="{name: 'settings'}">
            <div class="flex items-center cursor-pointer">
              <img
                class="w-8 mr-5 lg:mr-2"
                src="~/assets/img/settings.svg"
                alt="White tools icon representing settings"
              />
              <span class="hidden lg:inline text-sm uppercase">Settings</span>
            </div>
          </nuxt-link>
        </div>
        <div class="flex items-center lg:mr-10 cursor-pointer opacity-50" @click="logout">
          <img class="w-8 lg:mr-2" src="~/assets/img/logout.svg" alt="White logout icon" />
          <span class="hidden lg:inline text-sm uppercase">Logout</span>
        </div>
      </div>
    </div>
    <div class="sm:hidden">
      <DropdownMenu @logout="logout" v-if="isDropdownMenuOpen && $auth.loggedIn" />
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  components: {
    DropdownMenu: () => import('~/components/DropdownMenu')
  },
  computed: {
    ...mapGetters(['isDropdownMenuOpen'])
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$cookies.remove('jwt')
      this.$router.push({ name: 'login' })
    },
    setIsDropdownMenuOpen() {
      this.$store.dispatch('setIsDropdownMenuOpen', !this.isDropdownMenuOpen)
    }
  }
}
</script>

<style scoped>
</style>
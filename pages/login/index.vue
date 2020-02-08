<template>
  <div class="login">
    <button
      class="absolute flex items-center bg-blue-800 w-4/6 justify-center py-2 rounded-full max-w-xl shadow-xl hover:bg-blue-700 lg:w-1/2"
      @click="login"
    >
      <span class="mr-2 uppercase text-white">Log In</span>
      <span>
        <img class="w-8 rounded" src="~/assets/img/facebook.svg" alt="Facebook icon" />
      </span>
    </button>
    <div class="bg-blue-200 px-4 py-2 inline-block">
      <p class="text-sm font-semibold">Facebook Test User</p>
      <p class="text-sm font-semibold">Email: srjivqxzmy_1580048820@tfbnw.net</p>
      <p class="text-sm font-semibold">Password: DanielAlisonsen99</p>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Log In'
  },
  methods: {
    login() {
      this.$auth.loginWith('facebook')
    }
  },
  asyncData({ $auth, redirect }) {
    if ($auth.loggedIn) {
      redirect({ name: 'index' })
    }
  }
}
</script>

<style scoped>
.login {
  margin-top: 80px;
  height: calc(100vh - 80px);
}
.login > button {
  left: 50%;
  transform: translateX(-50%);
  top: 50%;
}
</style>
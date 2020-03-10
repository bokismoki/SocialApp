<template>
  <div class="search_user">
    <div class="lg:mb-5">
      <div>
        <label
          class="text-gray-900 text-xs uppercase mr-2 font-semibold cursor-pointer"
          for="search"
        >Search User:</label>
        <div class="flex items-center">
          <label class="cursor-pointer" for="search">
            <img
              class="w-5 h-5 mr-1"
              src="~/assets/img/magnifying-glass.svg"
              alt="Gray magnifying glass icon"
            />
          </label>
          <input
            class="px-1 placeholder-black text-sm rounded border-2 border-gray-300"
            type="search"
            placeholder="User name..."
            id="search"
            v-model="searchValue"
            @input="search"
          />
        </div>
      </div>
      <div class="mt-2">
        <div v-if="searchValue">
          <div v-if="users.length > 0">
            <div v-for="user in users" :key="user.id">
              <div v-if="user.id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)">
                <SearchUserItem :user="user" @emitUser="emitUser" />
              </div>
            </div>
          </div>
          <div v-else>
            <h2 class="text-sm">No users found.</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchUser',
  components: {
    SearchUserItem: () => import('~/components/SearchUserItem')
  },
  data() {
    return {
      searchValue: '',
      users: []
    }
  },
  methods: {
    search() {
      const regex = /^[a-z0-9]+$/i
      const isAlphanumeric = regex.test(this.searchValue.trim())
      if (this.searchValue.trim() && isAlphanumeric) {
        this.$store.dispatch('setIsLoading', true)
        this.$axios
          .get(`/user/get/by_input/${this.searchValue.toLowerCase().trim()}`)
          .then(response => {
            this.users = response.data.users
            this.$store.dispatch('setIsLoading', false)
          })
          .catch(err => {
            console.error(err)
            this.$store.dispatch('setIsLoading', false)
          })
      }
    },
    emitUser(user) {
      this.$emit('emitUser', user)
    }
  },
  watch: {
    searchValue(val) {
      if (val === '' && this.users.length > 0) {
        this.users = []
      }
    }
  }
}
</script>

<style scoped>
</style>
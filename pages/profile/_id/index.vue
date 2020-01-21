<template>
  <div class="profile_id">
    <div class="container mx-auto">
      <div
        class="relative h-40 max-w-5xl mx-auto"
        :style="{'background': `url(${profileBackground}) center/cover no-repeat`}"
      >
        <img
          class="profile_image absolute w-32 h-32 rounded-full border-4"
          :src="user.image"
          alt="My Facebook profile image"
        />
      </div>
      <div class="py-16 px-5 max-w-5xl mx-auto">
        <h1
          class="text-gray-800 uppercase font-black text-3xl leading-none"
        >{{user.first_name}} {{user.last_name}}</h1>
        <div class="flex items-end mt-1">
          <img class="w-4 mr-1" src="~/assets/img/email.svg" alt />
          <h3 class="text-gray-800 text-xs font-semibold">{{user.email}}</h3>
        </div>
        <div class="lg:flex lg:items-start lg:mt-10">
          <div class="mt-20 lg:w-2/3 lg:-mt-6">
            <h1
              class="uppercase text-gray-800 font-semibold text-2xl mb-5"
            >{{user.first_name}}'s Posts</h1>
            <h1 v-if="posts.length === 0">No posts to display, please add one.</h1>
            <div v-for="post in posts" :key="post.id">
              <PostItem :post="post" :user="user" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.user.first_name} ${this.user.last_name}`
    }
  },
  middleware: 'auth',
  components: {
    PostItem: () => import('~/components/PostItem')
  },
  data() {
    return {
      profileBackground: require('~/assets/img/profile_background.jpg')
    }
  },
  async asyncData({ $axios, $auth, redirect, params }) {
    try {
      const user = await $axios.get(`/user/get/${params.id}`)
      if (user.data.user.id === $auth.user.id) {
        redirect({ name: 'profile' })
      } else {
        const posts = await $axios.get(`/post/by_user/${user.data.user.id}`)
        const publicPosts = posts.data.posts.filter(
          post => post.is_private === 0
        )
        return {
          user: user.data.user,
          posts: publicPosts
        }
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
.profile_id {
  margin-top: 80px;
}
.profile_image {
  bottom: -30%;
  left: 10%;
}
</style>
<template>
  <div class="profile">
    <div class="container mx-auto">
      <div
        class="relative h-40 max-w-5xl mx-auto rounded-b"
        :style="{'background': `url(${profileBackground}) center/cover no-repeat`}"
      >
        <img
          class="profile_image absolute w-32 h-32 rounded-full border-4 border-white shadow-big"
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
        <div class="flex items-center mt-1">
          <p class="text-blue-600 font-black mr-1">Followers:</p>
          <div class="w-8 h-8 bg-blue-600 text-white font-semibold rounded-full flex">
            <p class="m-auto text-lg">{{followers_count}}</p>
          </div>
        </div>
        <div class="lg:flex lg:items-start lg:mt-10">
          <div class="lg:w-1/3 lg:mr-10">
            <PostForm @newPost="newPost" />
          </div>
          <div class="mt-20 lg:w-2/3 lg:-mt-6">
            <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">My Posts</h1>
            <h1 v-if="posts.length === 0">No posts to display, please add one.</h1>
            <div v-for="(post, index) in posts" :key="post.id">
              <PostItem
                :post="post"
                :user="user"
                :index="index"
                :likes_count="post.likes_count"
                :comments_count="post.comments_count"
                @liked="liked"
                @disliked="disliked"
                @deletePost="deletePost"
              />
            </div>
            <div>
              <button
                class="bg-blue-700 text-white mx-1 px-2 rounded-sm font-semibold"
                :class="{'px-3 py-1': activePaginationIndex === index}"
                v-for="(btn, index) in paginationButtonsCount"
                :key="index"
                @click="updatePagination(index)"
              >{{index + 1}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'My Profile'
  },
  middleware: 'auth',
  components: {
    PostForm: () => import('~/components/PostForm'),
    PostItem: () => import('~/components/PostItem')
  },
  data() {
    return {
      profileBackground: require('~/assets/img/profile_background.png'),
      activePaginationIndex: 0
    }
  },
  computed: {
    paginationButtonsCount() {
      return Math.ceil(this.posts_count / 15)
    }
  },
  methods: {
    newPost(payload) {
      this.posts.unshift({ ...payload, likes_count: 0, comments_count: 0 })
    },
    deletePost(payload) {
      this.posts.splice(payload, 1)
    },
    liked(payload) {
      this.posts[payload].likes_count++
    },
    disliked(payload) {
      this.posts[payload].likes_count--
    },
    async updatePagination(index) {
      try {
        if (this.activePaginationIndex !== index) {
          this.activePaginationIndex = index
          this.$store.dispatch('setIsLoading', true)
          const posts = await this.$axios.get(
            `/post/get/by_user/${
              this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub
            }/${index}`
          )

          this.posts = posts.data.posts
          window.scrollTo(0, 0)
          this.$store.dispatch('setIsLoading', false)
        }
      } catch (err) {
        this.$store.dispatch('setErrorMsg', err)
        redirect({ name: 'index' })
        this.$store.dispatch('setIsLoading', false)
      }
    }
  },
  async asyncData({ $axios, $auth, store, redirect }) {
    try {
      store.dispatch('setIsLoading', true)
      const user = await $axios.get(
        `/user/get/${$auth.user.id ? $auth.user.id : $auth.user.sub}`
      )
      const posts = await $axios.get(
        `/post/get/by_user/${$auth.user.id ? $auth.user.id : $auth.user.sub}/0`
      )
      const posts_count = await $axios.get(
        `/post/get/count/by_user/${
          $auth.user.id ? $auth.user.id : $auth.user.sub
        }`
      )
      const followersCount = await $axios.get(
        `follow/get/count/by_user/${
          $auth.user.id ? $auth.user.id : $auth.user.sub
        }`
      )
      store.dispatch('setIsLoading', false)
      return {
        user: user.data.user,
        posts: posts.data.posts,
        posts_count: posts_count.data.posts_count,
        followers_count: followersCount.data.followersCount
      }
    } catch (err) {
      store.dispatch('setErrorMsg', err)
      redirect({ name: 'index' })
      store.dispatch('setIsLoading', false)
    }
  }
}
</script>

<style scoped>
.profile {
  margin-top: 80px;
}
.profile_image {
  bottom: -30%;
  left: 10%;
}
</style>
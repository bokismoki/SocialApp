<template>
  <div class="profile">
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
          <div class="lg:w-1/3 lg:mr-10">
            <PostForm @newPost="newPost" />
          </div>
          <div class="mt-20 lg:w-2/3 lg:-mt-6">
            <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">My Posts</h1>
            <h1 v-if="posts.length === 0">No posts to display, please add one.</h1>
            <div v-for="(post, index) in displayedPosts" :key="post.id">
              <PostItem
                :post="post"
                :user="user"
                :index="index"
                :likes_count="likes[index].likes_count"
                :comments_count="comments[index].comments_count"
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
      profileBackground: require('~/assets/img/profile_background.jpg'),
      activePaginationIndex: 0
    }
  },
  computed: {
    paginationButtonsCount() {
      return Math.ceil(this.posts.length / 15)
    },
    displayedPosts() {
      return this.posts.slice().splice(this.activePaginationIndex * 15, 15)
    }
  },
  methods: {
    newPost(payload) {
      this.posts.unshift(payload)
      this.likes.unshift({ likes_count: 0 })
      this.comments.unshift({ comments_count: 0 })
    },
    deletePost(payload) {
      this.posts.splice(payload, 1)
    },
    liked(payload) {
      this.likes[payload].likes_count++
    },
    disliked(payload) {
      this.likes[payload].likes_count--
    },
    updatePagination(index) {
      this.activePaginationIndex = index
    }
  },
  async asyncData({ $axios, $auth }) {
    try {
      const user = await $axios.get(`/user/get/${$auth.user.id}`)
      const posts = await $axios.get(`/post/get/by_user/${$auth.user.id}`)
      const likes = await $axios.get(
        `/like/get/count/for_profile/${$auth.user.id}`
      )
      const comments = await $axios.get(
        `/comment/get/count/for_profile/${$auth.user.id}`
      )
      return {
        user: user.data.user,
        posts: posts.data.posts,
        likes: likes.data.likes,
        comments: comments.data.comments
      }
    } catch (err) {
      console.error(err)
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
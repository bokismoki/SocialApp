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
        <div class="flex items-end">
          <button
            class="uppercase mt-3 rounded-full px-5 py-1 bg-blue-700 text-white font-semibold tracking-widest shadow-lg hover:bg-blue-600"
            @click="follow"
          >{{isFollowing ? 'Unfollow' : 'Follow'}}</button>
          <div class="ml-2 w-8 h-8 bg-blue-600 text-white font-semibold rounded-full flex">
            <p class="m-auto">{{followers_count}}</p>
          </div>
        </div>
        <div class="lg:flex lg:items-start lg:mt-10">
          <div class="mt-20 lg:w-2/3 lg:-mt-6">
            <h1
              class="uppercase text-gray-800 font-semibold text-2xl mb-5 mt-10"
            >{{user.first_name}}'s Posts</h1>
            <h1 v-if="posts.length === 0">No posts to display.</h1>
            <div v-for="(post, index) in displayedPosts" :key="post.id">
              <PostItem
                :post="post"
                :user="user"
                :index="index"
                :likes_count="likes[index].likes_count"
                :comments_count="comments[index].comments_count"
                @liked="liked"
                @disliked="disliked"
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
    follow() {
      this.$axios
        .post(
          '/follow/set',
          {
            followee_id: this.$route.params.id,
            follower_id: this.$auth.user.id,
            user_id: this.$auth.user.id
          },
          {
            headers: {
              'content-type': 'application/json'
            }
          }
        )
        .then(response => {
          const { followed, unfollowed } = response.data
          if (followed) {
            this.isFollowing = true
            this.followers_count++
          } else if (unfollowed) {
            this.isFollowing = false
            this.followers_count--
          }
        })
        .catch(err => {
          console.error(err)
        })
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
  async asyncData({ $axios, $auth, redirect, params }) {
    try {
      const user = await $axios.get(`/user/get/${params.id}`)
      if (user.data.user.id === $auth.user.id) {
        redirect({ name: 'profile' })
      } else {
        const isFollowing = await $axios.get(
          `/follow/get/by_user/${user.data.user.id}/${$auth.user.id}`
        )
        const posts = await $axios.get(`/post/get/by_user/${user.data.user.id}`)
        const publicPosts = posts.data.posts.filter(
          post => post.is_private === 0
        )
        const likes = await $axios.get(
          `/like/get/count/public_by_user/${params.id}`
        )
        const comments = await $axios.get(
          `/comment/get/count/public_by_user/${params.id}`
        )
        const followersCount = await $axios.get(
          `follow/get/count/by_user/${params.id}`
        )
        return {
          user: user.data.user,
          posts: publicPosts,
          isFollowing: isFollowing.data.isFollowing,
          likes: likes.data.likes,
          comments: comments.data.comments,
          followers_count: followersCount.data.followersCount
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
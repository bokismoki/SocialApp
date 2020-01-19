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
            <div class="mt-10 lg:mt-0">
              <div class="flex items-center">
                <div
                  class="flex items-center mr-10 cursor-pointer"
                  :class="{'opacity-50': containsImage}"
                  @click="containsImage = false"
                >
                  <img class="w-5 mr-1" src="~/assets/img/feather.svg" alt="Gray feater icon" />
                  <span class="text-gray-800 font-semibold">Text</span>
                </div>
                <div
                  class="flex items-center cursor-pointer"
                  :class="{'opacity-50': !containsImage}"
                  @click="containsImage = true"
                >
                  <img class="w-5 mr-1" src="~/assets/img/camera.svg" alt="Gray camera icon" />
                  <span class="text-gray-800 font-semibold">Image & Text</span>
                </div>
              </div>
            </div>
            <form @submit.prevent="post">
              <textarea
                class="px-2 py-1 mt-2 placeholder-black w-full"
                placeholder="What's on your mind?"
                v-model="bodyText"
              ></textarea>
              <div class="flex items-center justify-end my-3">
                <span class="mr-2 uppercase text-xs font-semibold">Share globally:</span>
                <img
                  class="w-6 cursor-pointer"
                  src="~/assets/img/network.svg"
                  alt="Gray network icon"
                  :class="{'opacity-50': isPrivate}"
                  @click="isPrivate = !isPrivate"
                />
              </div>
              <div class="flex items-start" v-if="containsImage">
                <input class="hidden" type="file" id="file" @change="processFile" />
                <label
                  class="bg-gray-800 text-white rounded-full cursor-pointer uppercase text-xs px-2 py-1 inline-block mr-3 hover:bg-gray-700"
                  for="file"
                >Add image</label>
                <div v-if="bodyImage">
                  <img class="body_image w-32" :src="bodyImage" alt="Body_image" />
                </div>
              </div>
              <button
                class="uppercase text-sm bg-blue-600 w-full text-white mt-2 font-semibold tracking-wide py-1 rounded-full hover:bg-blue-500"
                type="submit"
              >Post</button>
            </form>
          </div>
          <div class="mt-20 lg:w-2/3 lg:-mt-6">
            <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">My Posts</h1>
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
  head: {
    title: 'My Profile'
  },
  middleware: 'auth',
  components: {
    PostItem: () => import('~/components/PostItem')
  },
  data() {
    return {
      profileBackground: require('~/assets/img/profile_background.jpg'),
      bodyText: '',
      containsImage: false,
      bodyImage: '',
      isPrivate: false
    }
  },
  methods: {
    processFile(e) {
      const img = document.querySelector('.body_image')
      const file = e.target.files[0]

      const reader = new FileReader()

      reader.addEventListener('load', () => {
        this.bodyImage = reader.result
      })

      if (file.type.includes('image')) {
        reader.readAsDataURL(file)
      } else {
        console.error('Please select the right image format!')
        this.bodyImage = ''
      }
    },
    post() {
      if (this.bodyText) {
        this.$axios
          .post(
            '/post/add',
            {
              body_text: this.bodyText,
              body_image: this.bodyImage,
              is_private: Number(this.isPrivate),
              user_id: this.$auth.user.id
            },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            this.posts.unshift(response.data.post)
          })
          .catch(err => {
            console.error(err)
          })
      }
      this.bodyText = ''
      this.bodyImage = ''
      this.isPrivate = false
      this.containsImage = false
    }
  },
  async asyncData({ $axios, $auth }) {
    try {
      const user = await $axios.get(`/user/get/${$auth.user.id}`)
      const posts = await $axios.get(`/post/by_user/${$auth.user.id}`)
      return {
        user: user.data.user,
        posts: posts.data.posts
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
textarea {
  min-height: 100px;
  max-height: 150px;
}
</style>
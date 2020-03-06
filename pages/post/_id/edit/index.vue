<template>
  <div class="post_edit">
    <div class="container mx-auto max-w-5xl pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Post Editing</h1>
      <div class="mb-5 max-w-lg border-2 border-gray-300 shadow-big rounded p-5 bg-white">
        <h2 class="uppercase text-gray-800 font-semibold mb-5">Current Post:</h2>
        <div>
          <div class="flex items-center">
            <nuxt-link :to="{name: 'profile'}">
              <img
                class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
                :src="post.image"
                alt="My Facebook profile image"
              />
            </nuxt-link>
            <div>
              <nuxt-link :to="{name: 'profile'}">
                <h1 class="font-semibold">{{post.first_name}} {{post.last_name}}</h1>
              </nuxt-link>
              <div class="flex items-center">
                <p class="font-semibold text-xs mr-2">{{formatDate(post.created_at)}}</p>
                <img
                  class="w-4"
                  src="~/assets/img/network.svg"
                  alt="Gray network icon"
                  :class="{'opacity-50': post.is_private}"
                />
              </div>
            </div>
          </div>
        </div>
        <p class="mt-3">{{post.body_text}}</p>
        <img
          v-if="post.body_image"
          class="max-w-xs mt-2 rounded"
          :src="post.body_image"
          alt="Post image"
        />
      </div>
      <div class="mb-10">
        <div class="mb-2 flex items-center">
          <p class="mr-2">Keep the current text</p>
          <select class="border-2 border-gray-300 shadow" name="text" id="text" v-model="keepText">
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div class="flex items-center">
          <p class="mr-2">Keep the current image</p>
          <select
            class="border-2 border-gray-300 shadow"
            name="image"
            id="image"
            v-model="keepImage"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>
      <h2 class="uppercase text-gray-800 font-semibold mb-5">New Content:</h2>
      <div class="max-w-lg">
        <PostForm
          :keepText="keepText"
          :keepImage="keepImage"
          :currentText="post.body_text"
          :currentImage="post.body_image"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Post Edit ${this.post.post_id}`
    }
  },
  middleware: 'auth',
  components: {
    PostForm: () => import('~/components/PostForm')
  },
  data() {
    return {
      keepText: 'false',
      keepImage: 'false'
    }
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    }
  },
  async asyncData({ $axios, $auth, params, redirect, store }) {
    try {
      store.dispatch('setIsLoading', true)
      const post = await $axios.get(
        `/post/get/by_id/${$auth.user.id ? $auth.user.id : $auth.user.sub}/${
          params.id
        }`
      )
      if (
        ($auth.user.id ? $auth.user.id : $auth.user.sub) !==
        post.data.post.user_id
      ) {
        return redirect({ name: 'index' })
      }
      store.dispatch('setIsLoading', false)
      return {
        post: post.data.post
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
.post_edit {
  margin-top: 80px;
}
</style>
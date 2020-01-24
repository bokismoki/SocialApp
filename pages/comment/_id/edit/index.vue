<template>
  <div class="comment_edit">
    <div class="container mx-auto max-w-5xl pt-5 pb-16 px-5">
      <h1 class="uppercase text-gray-800 font-semibold text-2xl mb-5">Comment Editing</h1>
      <div class="mb-10 max-w-lg border-2 border-gray-300 rounded-lg p-5 bg-white">
        <h2 class="uppercase text-gray-800 font-semibold mb-5">Current Comment:</h2>
        <div class="flex items-center">
          <nuxt-link :to="{name: 'profile'}">
            <img
              class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
              :src="comment.image"
              alt="My Facebook profile image"
            />
          </nuxt-link>
          <div>
            <nuxt-link :to="{name: 'profile'}">
              <h1 class="font-semibold">{{comment.first_name}} {{comment.last_name}}</h1>
            </nuxt-link>
            <p class="font-semibold text-xs mr-2">{{formatDate(comment.created_at)}}</p>
          </div>
        </div>
        <p class="mt-3">{{comment.body_text}}</p>
      </div>
      <h2 class="uppercase text-gray-800 font-semibold mb-5">New Content:</h2>
      <div class="max-w-lg">
        <CommentForm />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Comment Edit ${this.comment.comment_id}`
    }
  },
  components: {
    CommentForm: () => import('~/components/CommentForm')
  },
  methods: {
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    }
  },
  async asyncData({ $axios, $auth, params, redirect }) {
    try {
      const comment = await $axios.get(`/comment/get/by_id/${params.id}`)
      if ($auth.user.id !== comment.data.comment.user_id) {
        return redirect({ name: 'index' })
      }
      return {
        comment: comment.data.comment
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped>
.comment_edit {
  margin-top: 80px;
}
</style>
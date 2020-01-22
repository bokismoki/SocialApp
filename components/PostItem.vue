<template>
  <div class="post_item mb-5 border-2 border-gray-300 rounded-lg p-5 bg-white">
    <div class="relative">
      <div class="flex items-center">
        <nuxt-link :to="href">
          <img
            v-if="post.image"
            class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
            :src="post.image"
            alt="Facebook profile image"
          />
          <img
            v-else
            class="rounded-full w-12 h-12 mr-2 border-2 border-blue-300"
            :src="user.image"
            alt="My Facebook profile image"
          />
        </nuxt-link>
        <div>
          <nuxt-link :to="href">
            <h1
              v-if="post.first_name && post.last_name"
              class="font-semibold"
            >{{post.first_name}} {{post.last_name}}</h1>
            <h1 v-else class="font-semibold">{{user.first_name}} {{user.last_name}}</h1>
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
      <img
        class="absolute top-0 right-0 w-5 cursor-pointer"
        src="~/assets/img/edit.svg"
        alt="Three dots icon"
        @click="toggleOptionsModal"
      />
      <div
        class="options_modal absolute hidden top-0 right-0 mt-5 p-1 shadow-lg bg-white border-2 border-gray-300"
      >
        <nuxt-link
          :to="{name: 'post-id', params: {id: post.post_id}}"
          class="w-full uppercase text-xs font-semibold px-2 py-1"
        >View Post</nuxt-link>
        <div v-if="displayEdit" class="w-full uppercase text-xs font-semibold px-2 py-1">Edit</div>
      </div>
    </div>
    <p class="mt-3">{{truncate(post.body_text)}}</p>
    <img v-if="post.body_image" class="mt-2" :src="post.body_image" alt="Post image" />
    <div class="flex mt-5">
      <nuxt-link
        :to="{name: 'post-id', params: {id: post.post_id}}"
        class="bg-blue-200 rounded-lg mr-4 px-2 py-1 flex justify-center"
      >
        <div class="relative" @click="like">
          <div
            class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
            v-if="$route.name === 'post-id'"
          >{{likes_count}}</div>
          <img class="w-4" src="~/assets/img/like.svg" alt="Gray like icon" />
        </div>
      </nuxt-link>
      <nuxt-link
        :to="{name: 'post-id', params: {id: post.post_id}}"
        class="bg-blue-200 rounded-lg px-2 py-1 flex justify-center"
      >
        <div class="relative">
          <div
            class="count absolute text-xs font-black text-red-800 bg-white border border-gray-500 rounded-full w-5 h-5 flex justify-center"
            v-if="$route.name === 'post-id'"
          >{{comments_count}}</div>
          <img class="w-4" src="~/assets/img/comments.svg" alt="Gray comments icon" />
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: ['post', 'user', 'likes_count', 'comments_count'],
  computed: {
    displayEdit() {
      if (this.$route.name !== 'profile') {
        return this.$auth.user.id === this.post.user_id
      } else {
        return true
      }
    },
    href() {
      if (this.$route.name === 'profile') {
        return { name: this.$route.name }
      } else if (this.$route.name === 'profile-id') {
        return { name: this.$route.name, params: { id: this.$route.params.id } }
      } else {
        return { name: 'profile-id', params: { id: this.post.user_id } }
      }
    }
  },
  methods: {
    truncate(text) {
      if (text) {
        if (text.length >= 100) {
          return text.substring(0, 100) + '...'
        }
        return text
      }
    },
    formatDate(date) {
      if (date) {
        return date.substring(0, 10)
      }
    },
    toggleOptionsModal(e) {
      const optionModal = e.target.nextElementSibling
      if (optionModal.classList.contains('hidden')) {
        optionModal.classList.remove('hidden')
      } else {
        optionModal.classList.add('hidden')
      }
    },
    like() {
      if (this.$route.name === 'post-id') {
        this.$axios
          .post(
            '/like/set',
            { post_id: this.$route.params.id, user_id: this.$auth.user.id },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            const { liked, disliked } = response.data
            if (liked) {
              this.$emit('liked')
            } else if (disliked) {
              this.$emit('disliked')
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
}
</script>

<style scoped>
.count {
  top: -80%;
  right: -100%;
}
</style>
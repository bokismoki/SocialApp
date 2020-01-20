<template>
  <div class="new_post_form">
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
</template>

<script>
export default {
  name: 'NewPostForm',
  data() {
    return {
      bodyText: '',
      bodyImage: '',
      isPrivate: false,
      containsImage: false
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
            this.$emit('newPost', response.data.post)
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
  }
}
</script>

<style scoped>
textarea {
  min-height: 100px;
  max-height: 150px;
}
</style>
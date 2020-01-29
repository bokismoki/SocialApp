<template>
  <div class="post_form">
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
    <form @submit.prevent="newPost">
      <textarea
        class="px-2 py-1 mt-2 placeholder-black w-full border-2 border-gray-300"
        :class="{'border-red-500': isBodyTextOverLimit}"
        placeholder="What's on your mind?"
        v-model="bodyText"
      ></textarea>
      <div class="flex justify-between justify-end my-3">
        <div
          class="text-xs opacity-75"
          :class="{'text-red-600 font-black': isBodyTextOverLimit}"
        >{{charactersLeft}}</div>
        <div class="flex items-center">
          <span class="mr-2 uppercase text-xs font-semibold">Share globally:</span>
          <img
            class="w-6 cursor-pointer"
            src="~/assets/img/network.svg"
            alt="Gray network icon"
            :class="{'opacity-50': isPrivate}"
            @click="isPrivate = !isPrivate"
          />
        </div>
      </div>
      <div class="relative flex items-start" v-if="containsImage">
        <button
          v-if="bodyImage"
          class="absolute w-5 h-5 bg-gray-800 rounded-full mt-10"
          @click="removeImage"
        >
          <img class="w-full h-full" src="~/assets/img/cross.svg" alt="White cross icon" />
        </button>
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
      >{{$route.name === 'post-id-edit' ? 'Finish editing' : 'Post'}}</button>
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
  computed: {
    charactersLeft() {
      if (this.bodyText) {
        return 255 - this.bodyText.trim().length
      }
    },
    isBodyTextOverLimit() {
      return this.charactersLeft < 0
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
    removeImage() {
      this.bodyImage = ''
    },
    newPost() {
      if (this.bodyText.trim() && !this.isBodyTextOverLimit) {
        this.$store.dispatch('setIsLoading', true)
        if (this.$route.name === 'post-id-edit') {
          this.$axios
            .put(`/post/update/${this.$route.params.id}`, {
              body_text: this.bodyText.trim(),
              body_image: this.bodyImage,
              is_private: Number(this.isPrivate),
              user_id: this.$auth.user.id
            })
            .then(response => {
              if (!response.data.success) {
                this.$store.dispatch('setErrorMsg', response.data.msg)
              }
              this.$router.push({ name: 'index' })
              this.$store.dispatch('setIsLoading', false)
            })
            .catch(err => {
              console.error(err)
              this.$store.dispatch('setIsLoading', false)
            })
        } else {
          this.$axios
            .post(
              '/post/add',
              {
                body_text: this.bodyText.trim(),
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
              if (response.data.success) {
                this.$emit('newPost', response.data.post)
                this.bodyText = ''
                this.bodyImage = ''
                this.isPrivate = false
                this.containsImage = false
              } else {
                this.$store.dispatch('setErrorMsg', response.data.msg)
                this.$router.push({ name: 'index' })
              }
              this.$store.dispatch('setIsLoading', false)
            })
            .catch(err => {
              console.error(err)
              this.$store.dispatch('setIsLoading', false)
            })
        }
      }
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
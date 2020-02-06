<template>
  <div class="post_form">
    <div class="mt-10 lg:mt-0">
      <div class="flex items-center">
        <div
          class="flex items-center mr-10 cursor-pointer"
          :class="{'opacity-50': containsImage}"
          @click="containsImage = false; removeImage()"
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
        class="px-2 py-1 mt-2 placeholder-black w-full shadow-big rounded border-2 border-gray-300"
        :class="{'border-red-500': isBodyTextOverLimit}"
        placeholder="What's on your mind?"
        v-model="bodyText"
      ></textarea>
      <div class="my-3">
        <div
          class="text-xs opacity-75"
          :class="{'text-red-600 font-black': isBodyTextOverLimit}"
        >{{charactersLeft}}</div>
        <div
          class="flex items-center"
          :class="{'justify-between': containsImage, 'justify-end': !containsImage}"
        >
          <div class="relative" v-if="containsImage">
            <input class="hidden" type="file" id="file" @change="processFile" />
            <p class="absolute text-xs font-semibold mt-6 pt-1 opacity-75">max 2MB*</p>
            <label
              class="bg-gray-800 text-white rounded cursor-pointer uppercase text-xs px-2 py-1 inline-block hover:bg-gray-700"
              for="file"
            >Add image</label>
          </div>
          <div class="flex items-center py-1">
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
        <div class="mt-2 relative" v-if="bodyImage && containsImage">
          <button class="absolute w-5 h-5 bg-gray-800 rounded-full mt-1 ml-1" @click="removeImage">
            <img class="w-full h-full" src="~/assets/img/cross.svg" alt="White cross icon" />
          </button>
          <div v-if="bodyImage">
            <img class="body_image w-32 rounded" :src="bodyImage" alt="Body_image" />
          </div>
        </div>
      </div>
      <button
        class="uppercase text-sm bg-blue-600 w-full text-white mt-2 font-semibold tracking-wide py-1 rounded hover:bg-blue-500"
        type="submit"
      >{{$route.name === 'post-id-edit' ? 'Finish editing' : 'Post'}}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PostForm',
  props: ['keepText', 'keepImage', 'currentText', 'currentImage'],
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

      if (file.type.includes('image') && file.size < 2000000) {
        reader.readAsDataURL(file)
      } else {
        console.error('Wrong file format or too large file (max 2MB allowed)!')
        this.bodyImage = ''
      }
    },
    removeImage() {
      this.bodyImage = ''
    },
    newPost() {
      if (
        (this.bodyText.trim() ||
          (this.currentText.trim() && this.keepText === 'true')) &&
        !this.isBodyTextOverLimit
      ) {
        this.$store.dispatch('setIsLoading', true)
        if (this.$route.name === 'post-id-edit') {
          let textToSend
          let imageToSend
          if (this.keepText === 'true') {
            textToSend = this.currentText
          } else {
            textToSend = this.bodyText.trim()
          }
          if (this.keepImage === 'true') {
            imageToSend = this.currentImage
          } else {
            imageToSend = this.bodyImage
          }
          this.$axios
            .put(`/post/update/${this.$route.params.id}`, {
              body_text: textToSend,
              body_image: imageToSend,
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
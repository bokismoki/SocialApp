<template>
  <div class="image_modal">
    <div class="modal_bg fixed w-screen min-h-screen top-0 left-0 z-50 flex" @click.self="closeImageModal">
      <div class="absolute top-0 right-0 mt-5 mr-5" @click="closeImageModal">
        <button class="flex items-center bg-blue-600 px-2 rounded">
          <p class="text-white font-semibold">Close</p>
          <img class="w-10 h-10" src="~/assets/img/cross.svg" alt="Cross Icon" />
        </button>
      </div>
      <div class="m-auto px-5">
        <img class="w-full rounded border-2 border-white" :src="imageSrc" alt="Post Image" style="max-width: 800px;" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ImageModal',
  computed: {
    ...mapGetters(['imageSrc'])
  },
  methods: {
    closeImageModal() {
      this.$store.dispatch('setImageSrc', '')
    }
  }
}
</script>

<style scoped>
.modal_bg {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
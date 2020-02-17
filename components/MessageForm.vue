<template>
  <div class="message_form">
    <form class="mt-5" @submit.prevent="newMsg">
      <textarea
        class="px-1 placeholder-black text-sm rounded border-2 border-gray-300 w-full"
        type="text"
        placeholder="Type a message..."
        v-model="msg"
      ></textarea>
      <button
        class="uppercase text-sm bg-blue-600 w-full text-white mt-2 font-semibold tracking-wide py-1 rounded hover:bg-blue-500"
        type="submit"
      >Send</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'MessageForm',
  props: ['receiver_id'],
  data() {
    return {
      msg: ''
    }
  },
  methods: {
    newMsg() {
      if (this.msg.trim()) {
        this.$axios
          .post(
            '/message/add',
            {
              body_text: this.msg.trim(),
              user_id: this.$auth.user.id
                ? this.$auth.user.id
                : this.$auth.user.sub,
              receiver_id: this.receiver_id
            },
            {
              headers: {
                'content-type': 'application/json'
              }
            }
          )
          .then(response => {
            if (!response.data.success) {
              this.$store.dispatch('setErrorMsg', response.data.msg)
              this.$router.push({ name: 'index' })
            } else {
              this.$emit('newMsg', response.data.message)
            }
          })
          .catch(err => {
            console.error(err)
          })
        this.msg = ''
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
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
import io from 'socket.io-client'

export default {
  name: 'MessageForm',
  props: ['receiver_id'],
  data() {
    return {
      socket: io('https://social-app-social.herokuapp.com/api'),
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
              this.socket.emit('newMsg', {
                ...response.data.message,
                user_name: this.$auth.user.name
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
        this.msg = ''
      }
    },
    listenSocket() {
      this.socket.on('sendNewMsg', msg => {
        if (
          (this.$auth.user.id ? this.$auth.user.id : this.$auth.user.sub) ===
            msg.receiver_id &&
          msg.user_id === this.receiver_id
        ) {
          this.$emit('newMsg', msg)
        }
      })
    }
  },
  created() {
    this.listenSocket()
  }
}
</script>

<style scoped>
textarea {
  min-height: 100px;
  max-height: 150px;
}
</style>
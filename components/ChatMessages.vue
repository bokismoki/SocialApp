<template>
  <div class="chat_messages">
    <h1 class="font-semibold mb-3 text-blue-600">To: {{receiver_name}}</h1>
    <div class="messages border-2 bg-white shadow-big border-gray-400 rounded p-2 overflow-y-auto">
      <h1 v-if="messages.length === 0">Start chatting!</h1>
      <div v-for="msg in messages" :key="msg.message_id">
        <div
          class="flex items-center mb-2"
          :class="{'justify-end': msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)}"
        >
          <div
            v-if="msg.user_id === ($auth.user.id ? $auth.user.id : $auth.user.sub)"
            class="user_image h-8 self-start"
          >
            <img :src="msg.user_image" class="h-full rounded-full border-2 border-blue-300" alt />
          </div>
          <div
            class="relative"
            :class="{'ml-2': msg.user_id === ($auth.user.id ? $auth.user.id : $auth.user.sub), 'mr-2': msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)}"
          >
            <div
              v-if="msg.user_id === ($auth.user.id ? $auth.user.id : $auth.user.sub)"
              class="triangle-left absolute left-0 top-0 w-0 h-0 mt-2 border-transparent border-t-4 border-b-4 border-r-8"
            ></div>
            <p
              class="text-xs font-semibold rounded mx-2 px-2 py-1 break-words max-w-full"
              :class="{'bg-blue-600 text-white': msg.user_id === ($auth.user.id ? $auth.user.id : $auth.user.sub), 'bg-gray-500': msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)}"
            >{{msg.body_text}}</p>
            <div
              v-if="msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)"
              class="triangle-right absolute right-0 top-0 w-0 h-0 mt-2 border-transparent border-t-4 border-b-4 border-l-8"
            ></div>
          </div>
          <div
            v-if="msg.user_id !== ($auth.user.id ? $auth.user.id : $auth.user.sub)"
            class="user_image h-8 self-start"
          >
            <img
              :src="msg.user_image"
              class="h-full rounded-full shadow border-2 border-blue-300"
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatMessages',
  props: ['receiver_name', 'messages']
}
</script>

<style scoped>
.messages {
  height: 300px;
}
.user_image {
  min-width: 2em;
}
.triangle-left {
  border-right-color: #3182ce;
}
.triangle-right {
  border-left-color: #a0aec0;
}
</style>
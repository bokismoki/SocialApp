<template>
  <div class="social_sharing">
    <social-sharing
      :url="`https://social-app-social.herokuapp.com/post/${post.post_id}`"
      :title='`"${post.body_text}"`'
      :quote='`"${post.body_text}"`'
      hashtags="socialappsocial"
      inline-template
    >
      <div class="flex items-center">
        <button class="p-1">
          <network network="facebook">
            <img class="w-5 h-5 rounded" src="~/assets/img/facebook.svg" alt="Facebook Logo" />
          </network>
        </button>
        <button class="p-1">
          <network network="twitter">
            <img class="w-5 h-5 rounded" src="~/assets/img/twitter.svg" alt="Twitter Logo" />
          </network>
        </button>
      </div>
    </social-sharing>
  </div>
</template>

<script>
export default {
  name: 'MySocialSharing',
  props: ['post']
}
</script>

<style scoped>
</style>
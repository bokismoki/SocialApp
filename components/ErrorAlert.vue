<template>
  <div class="error_alert fixed z-50 bg-red-600 w-full text-right text-white font-semibold p-2">
    <p>{{errorMsg || 'You are offline...'}}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ErrorAlert',
  computed: {
    ...mapGetters(['errorMsg'])
  }
}
</script>

<style scoped>
.error_alert {
  top: 80px;
}
</style>
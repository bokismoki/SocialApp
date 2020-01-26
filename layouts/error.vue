<template>
  <div class="min-h-screen flex">
    <h1
      v-if="error.statusCode === 404"
      class="m-auto uppercase font-black text-center w-5/6 lg:text-xl xl:text-2xl"
    >The page you are trying to access does not exist</h1>
    <h1
      v-else
      class="m-auto uppercase font-black text-center w-5/6 lg:text-xl xl:text-2xl"
    >An error occured</h1>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Error - 404'
  },
  props: ['error']
}
</script>

<style scoped>
</style>
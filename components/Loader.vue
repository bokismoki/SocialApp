<template>
  <div class="loader_container fixed top-0 left-0 w-screen h-screen z-50 flex">
    <img class="m-auto w-10 h-10 lg:w-16 lg:h-16" src="~/assets/img/loader.svg" alt="Loader image" />
  </div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style scoped>
.loader_container {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
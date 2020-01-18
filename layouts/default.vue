<template>
  <div class="app">
    <NavBar />
    <nuxt />
  </div>
</template>

<script>
export default {
  components: {
    NavBar: () => import('~/components/NavBar')
  }
}
</script>

<style>
*,
*:before,
*:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  scroll-behavior: smooth;
}
</style>

<template>
  <div class="login">
    <button
      class="absolute flex items-center bg-blue-800 w-4/6 justify-center py-2 rounded-full max-w-xl shadow-xl hover:bg-blue-700 lg:w-1/2"
    >
      <span class="mr-2 uppercase text-white">Log In</span>
      <span>
        <img class="w-8 rounded" src="~/assets/img/facebook.svg" alt="Facebook icon" />
      </span>
    </button>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Log In'
  }
}
</script>

<style scoped>
.login {
  margin-top: 80px;
  height: calc(100vh - 80px);
}
.login > button {
  left: 50%;
  transform: translateX(-50%);
  top: 50%;
}
</style>
<script setup>
const props = defineProps({
  link: {type: String, required: true},
  icon: {type: String, required: true}
})
</script>

<template>
  <a
      :href="link"
      class="link-underline link-underline-opacity-0 text-white fs-1"
      target="_blank"
  >
    <i
        class="bi"
        :class="`bi-${icon}`"
    ></i>
  </a>
</template>

<style scoped>

</style>
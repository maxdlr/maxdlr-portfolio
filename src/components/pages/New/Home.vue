<script setup>
import Box from "./Box.vue";
</script>
<template>
  <section class="grid grid-cols-3 grid-rows-5 gap-3 grid-flow-dense">
    <Box :w="3">
      <span>My name is</span>
    </Box>
    <Box :w="2" :h="2">
      <span
        >text text text text text text text text text text text text text text
        text text text text text text text text text text text text text text
        text text text text text text text text text text text text text text
        text text</span
      >
    </Box>
    <Box :w="1" :h="1">
      <span>link </span>
    </Box>
  </section>
</template>

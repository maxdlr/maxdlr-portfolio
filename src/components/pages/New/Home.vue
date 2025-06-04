<script setup>
import TwLoader from "./TwLoader.vue";
import Box from "./Box.vue";
const colFull = 4;
</script>
<template>
  <TwLoader />
  <main class="lg:mx-24 xl:mx-52 2xl:mx-64">
    <section
      :class="['grid', `grid-cols-${colFull}`, 'grid-rows-5', 'gap-3', 'm-3']"
    >
      <Box :w="colFull">
        <h1 class="text-center">Maxime de la Rocheterie</h1>
      </Box>

      <Box :w="{ _: colFull, sm: 3, md: 2 }" :h="{ _: 2, sm: 1 }">
        <div class="h-full w-full flex justify-center items-center">
          <h2 class="text-center">Full stack developer - Java/Angular</h2>
        </div>
      </Box>

      <Box :w="{ _: 2, sm: 1 }" :h="{ _: 1 }">
        <h3 class="text-center">CV</h3>
      </Box>

      <Box :w="{ _: 2 }" :h="{ _: 4 }">
        <span>github, latest respos, contributions... etc </span>
      </Box>

      <Box :w="{ _: 2, sm: 1, md: 2 }" :h="{ _: 3, sm: 3 }">
        <span>linkedin, diplomas ?</span>
      </Box>

      <Box :w="{ _: 1 }" :h="{ _: 5, sm: 3 }">
        <span>links</span>
      </Box>

      <Box :w="{ _: colFull - 1, sm: 3, md: 2 }" :h="5">
        <span>some gifs</span>
      </Box>
    </section>
  </main>
</template>

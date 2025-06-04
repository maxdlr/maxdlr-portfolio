<script setup>
import TwLoader from "./TwLoader.vue";
import Box from "./Box.vue";
const colFull = 6;
const rowFull = 12;
</script>
<template>
  <TwLoader />
  <main class="px-4 pb-4 lg:px-24 xl:px-52 2xl:px-64">
    <section
      :class="['grid', `grid-cols-${colFull}`, `grid-rows-${rowFull}`, 'gap-1']"
    >
      <Box :w="colFull">
        <h1 class="text-center">Maxime de la Rocheterie</h1>
      </Box>

      <Box :w="{ _: colFull }" :h="{ _: 2 }">
        <div class="h-full w-full flex justify-center items-center">
          <h2 class="text-center">Full stack developer - Java/Angular</h2>
        </div>
      </Box>

      <Box :w="{ _: 3, sm: 1 }" :h="{ _: 1 }">
        <span>gh</span>
      </Box>

      <Box :w="{ _: 3, sm: 2 }" :h="{ _: 2 }">
        <h3 class="text-center">CV</h3>
      </Box>

      <Box :w="{ _: 2 }" :h="{ _: 1 }">
        <span>in</span>
      </Box>

      <Box :w="{ _: 1 }" :h="{ _: 1 }">
        <span>insta</span>
      </Box>

      <Box :w="{ _: colFull }" :h="{ _: 4 }">
        <span>github, latest respos, contributions... etc </span>
      </Box>

      <Box :w="{ _: colFull }" :h="{ _: 5 }">
        <span>some gifs</span>
      </Box>

      <Box :w="{ _: 2 }" :h="{ _: 1 }">
        <span>Blog</span>
      </Box>

      <Box :w="{ _: 2 }" :h="{ _: 1 }">
        <span>Motion</span>
      </Box>

      <Box :w="{ _: 2 }" :h="{ _: 1 }">
        <span>My feed</span>
      </Box>
    </section>
  </main>
</template>

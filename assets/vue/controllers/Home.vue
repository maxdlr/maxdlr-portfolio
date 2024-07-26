<script setup>
import SocialLink from "../component/SocialLink.vue";

const props = defineProps({
  socialLinks: {type: Object, required: true}
});

</script>

<template>
  <div class="text-center text-white py-4 my-3 rounded-5 border border-1 border-light">
    <h1 class="display-4">Maxdlr</h1>
    <p class="lead">Full-Stack Developer</p>
  </div>

  <div class="d-flex justify-content-center align-items-center">
    <SocialLink
        v-for="(socialLink, index) in socialLinks"
        :key="index"
        :link="socialLink.link"
        :icon="socialLink.icon"
        class="mx-2"
    />
  </div>

  <div class="gh-calendar"></div>

</template>

<script lang="ts" setup>
import data from "./model/data.json";
import Layout from "./components/atoms/Layout.vue";
import router from "./router";

const isRedirecting = (): boolean => !router.currentRoute.value.name;
</script>

<template>
  <div
    v-if="isRedirecting()"
    class="w-[100vw] h-[100vh] flex items-center justify-center max-md:px-5"
  >
    <div class="flex justify-center my-7">
      <a :href="data['footer-wip'].url" class="text-center" target="_blank">
        <img
          :class="`rounded-full`"
          :src="data.helper.loader"
          alt="maxime de la rocheterie maxorbe example gif"
        />
      </a>
    </div>
  </div>
  <Layout v-else>
    <router-view />
  </Layout>
</template>

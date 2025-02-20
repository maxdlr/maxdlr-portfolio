<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import {
  CommitDate,
  CommitDateWithIntensity,
  GithubService,
} from "../../../services/GithubService.ts";
import Loader from "../../atoms/Loader.vue";
import _ from "lodash";
import ContribSquare from "../../gh/ContribSquare.vue";

const contributions: Ref<CommitDate[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const githubService = new GithubService();
const intensityMap: Ref<CommitDateWithIntensity[]> = ref([]);

onMounted(async () => {
  // await refresh();
  const day = () => _.random(1, 31);
  const month = () => _.random(1, 12);
  const year = () => 2024;

  for (let i = 0; i < 300; i++) {
    contributions.value.push({
      day: day(),
      month: month(),
      year: year(),
    });
  }

  intensityMap.value = githubService.calculateDateIntensity(
    contributions.value,
  );
});

const refresh = async () => {
  isLoading.value = true;
  await githubService
    .logIn()
    .then(
      async () =>
        (contributions.value = await githubService.getAllCommitDates()),
    );
  isLoading.value = false;
};
</script>

<template>
  <div v-if="isLoading" class="w-fit mx-auto">
    <Loader />
  </div>
  <div v-else class="grid grid-cols-12">
    <div v-for="month in 12" :key="month">
      <div v-for="day in 31" :key="day">
        <div v-for="(contrib, index) in intensityMap" :key="index">
          <ContribSquare
            :intensity="contrib.intensity"
            v-if="contrib.day === day && contrib.month === month"
          />
        </div>
      </div>
    </div>

    <!--    <pre>{{ contributions }}</pre>-->
  </div>
</template>

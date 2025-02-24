<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import {
  CommitDate,
  CommitDateWithIntensity,
  GithubService,
} from "../../../services/GithubService.ts";
import Loader from "../../atoms/Loader.vue";
import ContribSquare from "../../gh/ContribSquare.vue";

const contributions: Ref<CommitDate[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const githubService = new GithubService();
const contributionsWithIntensity: Ref<CommitDateWithIntensity[]> = ref([]);

onMounted(async () => {
  isLoading.value = true;
  // await refresh();
  // const day = () => _.random(1, 31);
  // const month = () => _.random(1, 12);
  // const year = () => 2024;
  //
  // for (let i = 0; i < 300; i++) {
  //   contributions.value.push({
  //     day: day(),
  //     month: month(),
  //     year: year(),
  //   });
  // }
  await refresh();

  contributionsWithIntensity.value = githubService.calculateDateIntensity(
    contributions.value,
  );
  isLoading.value = false;
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

const dateMatch = (
  contrib: CommitDateWithIntensity,
  now: CommitDate,
): boolean => {
  const isDay = contrib.day === now.day;
  const isMonth = contrib.month === now.month;
  const isYear = true;

  return isDay && isMonth && isYear;
};
</script>

<template>
  <div>
    <div :class="[`bg-blue-50`]" />
    <div :class="[`bg-blue-100`]" />
    <div :class="[`bg-blue-200`]" />
    <div :class="[`bg-blue-300`]" />
    <div :class="[`bg-blue-400`]" />
    <div :class="[`bg-blue-500`]" />
    <div :class="[`bg-blue-600`]" />
    <div :class="[`bg-blue-700`]" />
    <div :class="[`bg-blue-800`]" />
    <div :class="[`bg-blue-900`]" />
    <div :class="[`bg-blue-950`]" />
  </div>
  <div v-if="isLoading" class="w-fit mx-auto">
    <Loader />
  </div>

  <div v-else class="flex justify-center items-start">
    <div
      v-for="month in 12"
      :key="month"
      class="flex flex-col justify-center items-start"
    >
      <div v-for="day in 31" :key="day">
        <div
          v-for="(contrib, index) in contributionsWithIntensity"
          :key="index"
        >
          <ContribSquare
            :intensity="contrib.intensity"
            color="blue"
            v-if="dateMatch(contrib, { day, month, year: 2024 })"
            :index="`${day}/${month}`"
          />
        </div>
        <!--        <ContribSquare :intensity="0" color="blue" :index="`${day}/${month}`" />-->
      </div>
    </div>
  </div>
  <pre>{{ contributionsWithIntensity }}</pre>
</template>

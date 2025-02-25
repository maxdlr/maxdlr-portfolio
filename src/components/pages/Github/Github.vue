<script lang="ts" setup>
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
const weekFirstDays: Ref<number[]> = ref([]);

const buildWeekFirstDays = () => {
  const totalDays: number = contributionsWithIntensity.value.length;
  const weeksCount: number = Math.floor(totalDays / 8);
  const firstDays: number[] = [];

  firstDays.push(1);
  for (let i = 1; i < weeksCount; i++) {
    firstDays.push(Math.floor(totalDays / (weeksCount / i)));
  }

  console.log(firstDays);

  weekFirstDays.value = firstDays;
};

onMounted(async () => {
  isLoading.value = true;
  await refresh();

  contributionsWithIntensity.value = githubService.calculateDateIntensity(
    contributions.value,
  );
  buildWeekFirstDays();
  isLoading.value = false;
});

const refresh = async () => {
  isLoading.value = true;
  contributions.value = await githubService.getAllCommitDates();
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

  <div v-else class="flex">
    <!--    <div class="flex flex-col gap-96">-->
    <!--    <div v-for="year in [2023, 2024, 2025]">-->
    <div v-for="month in 12" :key="month" class="flex">
      <div
        v-for="(week, index) in weekFirstDays"
        :key="index"
        class="flex flex-col"
      >
        <div v-for="day in 31" :key="day">
          <div v-if="day >= week && day < weekFirstDays[index + 1]">
            <div>
              <div
                v-for="(contrib, index) in contributionsWithIntensity"
                :key="index"
              >
                <ContribSquare
                  v-if="dateMatch(contrib, { day, month, year: 2024 })"
                  :index="`${day}/${month}/${2024}`"
                  :intensity="contrib.intensity"
                  class="m-[2px]"
                  color="blue"
                />
              </div>
            </div>
          </div>
          <!--          </div>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

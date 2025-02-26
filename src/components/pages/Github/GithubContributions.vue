<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import {
  CommitDateWithIntensity,
  GithubService,
} from "../../../services/GithubService.ts";
import Loader from "../../atoms/Loader.vue";
import ContribSquare from "../../gh/ContribSquare.vue";

const contribs: Ref<CommitDateWithIntensity[]> = ref([]);
const contribsByWeek: Ref<Record<number, CommitDateWithIntensity[]>> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const githubService = new GithubService();

const buildWeekFirstDays = () => {
  const daysPerCol: number = 17;
  const totalDays: number = contribs.value.length;
  const weeksCount: number = Math.floor(totalDays / daysPerCol);
  const firstDays: number[] = [];

  firstDays.push(1);
  for (let i = 0; i < weeksCount; i++) {
    firstDays.push(Math.floor(totalDays / (weeksCount / i)));
  }

  contribsByWeek.value = contribs.value.reduce(
    (
      acc: Record<number, CommitDateWithIntensity[]>,
      current: CommitDateWithIntensity,
      index: number,
    ) => {
      firstDays.forEach((weekFirstDay: number, wfdIndex: number) => {
        if (index >= weekFirstDay && index < firstDays[wfdIndex + 1]) {
          if (!acc[weekFirstDay]) acc[weekFirstDay] = [];
          if (acc[weekFirstDay].length < daysPerCol) {
            acc[weekFirstDay].push(current);
          } else {
            acc[firstDays[wfdIndex + 1]] = [current];
          }
        }
      });

      return acc;
    },
    {} as Record<number, CommitDateWithIntensity[]>,
  );
};

onMounted(async () => {
  await refresh();
  buildWeekFirstDays();
});

const refresh = async () => {
  isLoading.value = true;
  contribs.value = await githubService.getAllContributions(false);
  buildWeekFirstDays();
  isLoading.value = false;
};
const gap = "gap-[1px]";
</script>

<template>
  <div class="w-fit h-fit mx-auto">
    <div>
      <div :class="[`bg-gray-50`]" />
      <div :class="[`bg-gray-100`]" />
      <div :class="[`bg-gray-200`]" />
      <div :class="[`bg-gray-300`]" />
      <div :class="[`bg-gray-400`]" />
      <div :class="[`bg-gray-500`]" />
      <div :class="[`bg-gray-600`]" />
      <div :class="[`bg-gray-700`]" />
      <div :class="[`bg-gray-800`]" />
      <div :class="[`bg-gray-900`]" />
      <div :class="[`bg-gray-950`]" />
    </div>
    <div v-if="isLoading" class="w-fit mx-auto">
      <Loader />
    </div>

    <div v-else>
      <div class="flex justify-center items-start m-0 p-0" :class="gap">
        <div
          v-for="(week, index) in contribsByWeek"
          :key="index"
          class="flex flex-col p-0 m-0"
          :class="gap"
        >
          <div v-if="week.length >= 5">
            <div
              v-for="(contrib, contribIndex) in week"
              :key="contribIndex"
              class="m-0 p-0 w-[10px] h-[10px]"
            >
              <div
                class="m-0 p-0"
                :data-uk-tooltip="`title: ${contrib.day}/${contrib.month}/${contrib.year}; animation: slide-bottom`"
              >
                <ContribSquare
                  :contrib="contrib"
                  :intensity="contrib.intensity"
                  class="hover:bg-gray-700 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

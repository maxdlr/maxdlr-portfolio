<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import {
  CommitDate,
  CommitDateWithIntensity,
  GithubService,
} from "../../../services/GithubService.ts";
import Loader from "../../atoms/Loader.vue";
import ContribSquare from "../../gh/ContribSquare.vue";
import { ContributionsProcessor } from "../../../composables/processors/ContributionsProcessor.ts";

const contribs: Ref<CommitDateWithIntensity[]> = ref([]);
const contribsByWeek: Ref<Record<number, CommitDateWithIntensity[]>> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const githubService = new GithubService();

const buildWeekFirstDays = () => {
  const totalDays: number = contribs.value.length;
  const weeksCount: number = Math.floor(totalDays / 8);
  const firstDays: number[] = [];

  firstDays.push(1);
  for (let i = 1; i < weeksCount; i++) {
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
          acc[weekFirstDay].push(current);
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
  const contribDates: CommitDate[] =
    await githubService.GetAllActivityDatesWithIntensity(false);
  const contribProcessor = new ContributionsProcessor();
  const contribDatesWithIntensity =
    contribProcessor.calculateDateIntensity(contribDates);
  contribs.value = contribProcessor.sortDates(contribDatesWithIntensity);
  buildWeekFirstDays();
  isLoading.value = false;
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

  <div v-else>
    <div class="flex justify-start items-start">
      <div
        v-for="(week, index) in contribsByWeek"
        :key="index"
        class="flex flex-col"
      >
        <div v-for="(contrib, contribIndex) in week" :key="contribIndex">
          <ContribSquare :contrib="contrib" :intensity="contrib.intensity" />
        </div>
      </div>
    </div>
  </div>
</template>

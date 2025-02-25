<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import {
  CommitDateWithIntensity,
  GithubService,
} from "../../../services/GithubService.ts";
import Loader from "../../atoms/Loader.vue";
import ContribSquare from "../../gh/ContribSquare.vue";

const contributions: Ref<CommitDateWithIntensity[]> = ref([]);
const isLoading: Ref<boolean> = ref(false);
const githubService = new GithubService();
const weekFirstDays: Ref<number[]> = ref([]);

const buildWeekFirstDays = () => {
  const totalDays: number = contributions.value.length;
  const weeksCount: number = Math.floor(totalDays / 8);
  const firstDays: number[] = [];

  firstDays.push(1);
  for (let i = 1; i < weeksCount; i++) {
    firstDays.push(Math.floor(totalDays / (weeksCount / i)));
  }
  weekFirstDays.value = firstDays;
};

onMounted(async () => {
  await refresh();
  // console.log(contributions.value);
});

const refresh = async () => {
  isLoading.value = true;
  contributions.value =
    await githubService.GetAllActivityDatesWithIntensity(false);
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
    <div v-for="(contrib, index) in contributions" :key="index">
      <div
        v-for="(weekFirstDay, index) in weekFirstDays"
        :key="index"
        class="flex flex-col"
      >
        <ContribSquare
          :contrib="contrib"
          :intensity="contrib.intensity"
          v-if="
            contrib.day >= weekFirstDay &&
            contrib.day < weekFirstDays[index + 1]
          "
          :index="`${contrib.id} - ${contrib.day}/${contrib.month}`"
        />
      </div>
    </div>

    <!--    <div v-for="year in [2024, 2025]" class="w-full">-->
    <!--      <div v-for="month in 12" :key="month" class="flex w-full">-->
    <!--        <div-->
    <!--          v-for="(week, index) in weekFirstDays"-->
    <!--          :key="index"-->
    <!--          class="flex flex-col border border-black"-->
    <!--        >-->
    <!--          <div v-for="day in 31" :key="day">-->
    <!--            <div v-if="day >= week && day < weekFirstDays[index + 1]">-->
    <!--              <div-->
    <!--                v-for="(contrib, index) in contributionsWithIntensity"-->
    <!--                :key="index"-->
    <!--              >-->
    <!--                <ContribSquare-->
    <!--                  v-if="dateMatch(contrib, { day, month, year })"-->
    <!--                  :index="`${day}/${month}/${year}`"-->
    <!--                  :intensity="contrib.intensity"-->
    <!--                  class="m-[2px]"-->
    <!--                  color="blue"-->
    <!--                />-->
    <!--              </div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

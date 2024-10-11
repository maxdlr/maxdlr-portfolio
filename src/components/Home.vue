<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import {
  getAllCommitsFromRepo,
  getRepos,
} from "../composables/github/GithubFetchService.ts";
import { getMonthName } from "../composables/utils/utils.ts";

const buildCommitData = () => {
  let commitData = [];

  for (const yearNumber of [2023, 2024]) {
    for (let i = 1; i <= 12; i++) {
      for (let y = 1; y <= 31; y++) {
        commitData.push({
          day: y,
          month: i,
          year: yearNumber,
          commitCount: 0,
        });
      }
    }
  }

  console.log(commitData.value);
  return commitData;
};

const allCommitDates: Ref<{ day: number; month: number; year: number }[]> = ref(
  [],
);
const commitData: Ref<
  { day: number; month: number; year: number; commitCount: number }[]
> = ref(buildCommitData());

const getCommitCount = () => {
  for (const allCommitDatesKey in allCommitDates.value) {
    const commitDate = allCommitDates.value[allCommitDatesKey];
    for (const key in commitData.value) {
      const date = commitData.value[key];
      if (
        commitDate.day === date?.day &&
        commitDate.month === date?.month &&
        commitDate.year === date?.year
      ) {
        date.commitCount++;
      }
    }
  }
  localStorage.setItem("commitData", JSON.stringify(commitData.value));
};

const getAllCommits = async () => {
  const repoNames = [];
  await getRepos().then((repos) => {
    repos.map((repo) => repoNames.push(repo.name));
  });

  for (const repoName of repoNames) {
    await getAllCommitsFromRepo(repoName).then((commits) => {
      commits.map((commit) => {
        const date = new Date(commit.commit.committer.date);
        allCommitDates.value.push({
          day: date.getDay(),
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        });
      });
    });
  }
};

onMounted(async () => {
  await getAllCommits();
  getCommitCount();
});
</script>

<template>
  <div v-for="month in 12" class="flex">
    {{ getMonthName(month) }}
    <div v-for="(day, index) in commitData" :key="index" :id="`day-${index}`">
      <div v-if="day.month === month">
        <div class="w-[13px] h-[13px] m-1 text-center">
          {{ day.commitCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

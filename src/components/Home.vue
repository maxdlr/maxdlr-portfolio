<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import {
  getAllCommitsFromRepo,
  getOrganizations,
  getRepos,
} from "../composables/github/GithubFetchService.ts";

const buildYear = () => {
  let year = [];

  for (const yearNumber of [2023, 2024]) {
    for (let i = 1; i <= 12; i++) {
      for (let y = 1; y <= 31; y++) {
        year.push({
          day: y,
          month: i,
          year: yearNumber,
          commitCount: 0,
        });
      }
    }
  }
  return year;
};

const allCommitDates: Ref<{ day: number; month: number; year: number }[]> = ref(
  [],
);
const year: Ref<
  { day: number; month: number; year: number; commitCount: number }[]
> = ref(buildYear());

const getCommitCount = () => {
  for (const allCommitDatesKey in allCommitDates.value) {
    const commitDate = allCommitDates.value[allCommitDatesKey];
    for (const yearKey in year.value) {
      const date = year.value[yearKey];
      if (
        commitDate.day === date.day &&
        commitDate.month === date.month &&
        commitDate.year === date.year
      ) {
        date.commitCount++;
      }
    }
  }
  console.log(year.value);
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
  console.log(await getOrganizations());
  await getAllCommits();
  getCommitCount();
});
</script>

<template>
  <div v-for="month in 12" class="flex">
    <div v-for="(day, index) in year" :key="index" :id="`day-${index}`">
      <div v-if="day.month === month">
        <div class="w-[13px] h-[13px] m-1 text-center">
          {{ day.commitCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

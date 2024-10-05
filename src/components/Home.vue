<script setup lang="ts">
import { onBeforeMount } from "vue";
import {
  getAllCommitsFromRepo,
  getCommitsFromRepo,
  getOneRepo,
  getRepos,
} from "../composables/github/GithubFetchService.ts";
import { getDateOfCommit } from "../composables/github/GithubFetchUtils.ts";

onBeforeMount(async () => {
  console.log(
    "getCommitsFromRepo",
    await getAllCommitsFromRepo("gaming-gurus").then((commits) =>
      commits.map((commit) => commit.commit.committer.date),
    ),
  );
});
</script>

<template>wassup</template>

<style scoped></style>

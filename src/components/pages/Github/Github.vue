<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { CommitDate, GithubService } from "../../../services/GithubService.ts";

const contributions: Ref<CommitDate[]> = ref([]);

onMounted(async () => {
  const githubService = new GithubService();
  await githubService
    .logIn()
    .then(
      async () =>
        (contributions.value = await githubService.getAllCommitDates()),
    );
});
</script>

<template>
  <pre>{{ contributions }}</pre>
</template>

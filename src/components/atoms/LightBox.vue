<script setup lang="ts">
import { defineModel, computed, watchEffect } from "vue";
import Button from "./Button.vue";
import TransitionSlideUp from "../atoms/transitions/TransitionSlideUp.vue";
import { BIconArrowLeft, BIconArrowRight } from "bootstrap-icons-vue";

const path = defineModel<string | undefined>("path");
const currentPhotos = defineModel<string[]>("currentPhotos", {
  default: () => [],
});

const currentIndex = computed(() => {
  if (!path.value) return -1;
  return currentPhotos.value.indexOf(path.value);
});

const close = () => {
  path.value = undefined;
  window.location.hash = "";
};

const showNext = () => {
  if (path.value === undefined) return;
  const nextIndex = (currentIndex.value + 1) % currentPhotos.value.length;
  path.value = currentPhotos.value[nextIndex];
};

const showPrev = () => {
  if (path.value === undefined) return;
  const prevIndex =
    (currentIndex.value - 1 + currentPhotos.value.length) %
    currentPhotos.value.length;
  path.value = currentPhotos.value[prevIndex];
};

watchEffect((onCleanup) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (path.value === undefined) return;

    switch (event.key) {
      case "ArrowLeft":
        showPrev();
        break;
      case "ArrowRight":
        showNext();
        break;
      case "Escape":
        close();
        break;
    }
  };

  if (path.value !== undefined) {
    window.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden");
  }

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
    document.body.classList.remove("overflow-hidden");
  });
});
</script>

<template>
  <div
    v-if="path"
    class="fixed inset-0 z-40 bg-black bg-opacity-80"
    @click.self="close()"
    tabindex="-1"
  ></div>

  <TransitionSlideUp>
    <div
      v-if="path"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="relative w-full h-full rounded-2xl flex items-center justify-center"
        @click.stop=""
      >
        <div
          class="grid grid-cols-12 grid-rows-1 items-center justify-center max-h-[90%]"
        >
          <Button
            class="col-span-1 flex justify-center items-center"
            label="left"
            variant="ghost"
            extra-class="bg-none text-white hover:bg-black rounded-full"
            @click.prevent="showPrev()"
            ><BIconArrowLeft
          /></Button>
          <img
            :src="path"
            :alt="path"
            class="w-full rounded-2xl object-contain col-span-10 h-full mx-auto"
          />
          <Button
            class="col-span-1 flex justify-center items-center"
            label="right"
            variant="ghost"
            extra-class="bg-none text-white hover:bg-black rounded-full"
            @click.prevent="showNext()"
            ><BIconArrowRight
          /></Button>
        </div>

        <Button
          variant="ghost"
          extra-class="absolute top-4 right-4 w-14 h-14 z-10 rounded-full text-white"
          @click.prevent="close()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            class="bi bi-x-lg"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
            />
          </svg>
        </Button>
      </div>
    </div>
  </TransitionSlideUp>
</template>

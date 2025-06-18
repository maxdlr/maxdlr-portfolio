<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import Button from "../../atoms/Button.vue";
import LightBox from "../../atoms/LightBox.vue";
import _ from "lodash";
import Loader from "../../atoms/Loader.vue";

const filenames: Ref<Map<string, string[]>> = ref(new Map());
const currentCat: Ref<string | null> = ref(null);
const currentPhotos: Ref<string[]> = ref([]);
const unfoundPhotos: Ref<Set<string>> = ref(new Set());
const isLoading: Ref<boolean> = ref(false);

async function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      img.onerror = null;
      img.onload = null;
      resolve(false);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    img.src = url;
  });
}

const findPhotos = async (prefix: string, count: number): Promise<string[]> => {
  const checkPromises: Promise<{ path: string; exists: boolean }>[] = [];
  for (let i: number = 1; i <= count; i++) {
    const index = i.toString().length < 2 ? `0${i}` : i;
    const filePath = `/photos/${prefix}-${index}.jpg`;
    checkPromises.push(
      checkImageExists(filePath).then((exists: boolean) => ({
        path: filePath,
        exists,
      })),
    );
  }
  const results = await Promise.all(checkPromises);
  return results.filter((result) => result.exists).map((result) => result.path);
};

const registerFiles = async () => {
  filenames.value = new Map();
  const promises: Promise<void>[] = [];
  prefixes.forEach((prefix: string) => {
    promises.push(
      findPhotos(prefix, 12).then((existingPaths: string[]) => {
        filenames.value.set(prefix, existingPaths);
      }),
    );
  });
  await Promise.all(promises);
};

const filterPhotos = () => {
  let photosToDisplay: string[] = [];

  if (currentCat.value === null) {
    prefixes.forEach((prefix: string) => {
      const categoryPhotos = filenames.value.get(prefix);
      if (categoryPhotos) {
        photosToDisplay.push(...categoryPhotos);
      }
    });
  } else {
    photosToDisplay = filenames.value.get(currentCat.value) || [];
  }

  currentPhotos.value = photosToDisplay.filter((photo: string) => {
    return !unfoundPhotos.value.has(photo);
  });
};

const prefixes: string[] = ["stranger", "misc", "minolta", "widelux"];

const findHash = () => {
  if (!window.location.hash) return;
  const foundFileName: string = window.location.hash.substring(1);
  show(`/photos/${foundFileName}.jpg`);
};

onMounted(async () => {
  isLoading.value = true;
  await registerFiles();
  filterPhotos();
  findHash();
  isLoading.value = false;
});

const filterOut = (photo: string) => {
  unfoundPhotos.value.add(photo);
  filterPhotos();
};

const toggleCategory = (cat: string | null) => {
  currentCat.value = currentCat.value === cat ? null : cat;
  filterPhotos();
};

const currentLightBoxed: Ref<string | undefined> = ref(undefined);

const show = (photo: string) => {
  window.location.hash = getFilenameFromPath(photo);
  currentLightBoxed.value = photo;
};

function getFilenameFromPath(filePath: string) {
  const lastSlashIndex = filePath.lastIndexOf("/");
  let filenameWithExtension = filePath;

  if (lastSlashIndex !== -1) {
    filenameWithExtension = filePath.substring(lastSlashIndex + 1);
  }
  const lastDotIndex = filenameWithExtension.lastIndexOf(".");

  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    return filenameWithExtension.substring(0, lastDotIndex);
  }

  return filenameWithExtension;
}
</script>

<template>
  <div class="flex justify-center items-center flex-wrap gap-2 mb-5 mx-4 z-50">
    <Button
      label="All"
      :extra-class="currentCat === null ? 'bg-black text-white' : ''"
      @click.prevent="toggleCategory(null)"
    />
    <Button
      v-for="(cat, index) in prefixes"
      :key="index"
      :label="_.upperFirst(cat)"
      :extra-class="currentCat === cat ? 'bg-black text-white' : ''"
      @click.prevent="toggleCategory(cat)"
    />
  </div>
  <div v-if="isLoading" class="w-fit mx-auto">
    <Loader />
  </div>
  <div v-else-if="currentPhotos.length === 0" class="text-center w-full">
    No photos, apparently
  </div>
  <section class="flex justify-center items-start flex-wrap gap-5 mb-10" v-else>
    <LightBox
      v-model:path="currentLightBoxed"
      v-model:currentPhotos="currentPhotos"
    />
    <TransitionGroup
      name="photo-list"
      tag="div"
      class="grid grid-flow-row grid-cols-1 md:gap-5 gap-2 w-full"
    >
      <div
        v-for="(photo, index) in currentPhotos"
        :key="photo"
        class="xl:w-[60%] md:w-[80%] lg:w-[60%] w-[97%] img-div mx-auto"
        :style="{ '--delay': `${index * 80}ms` }"
        @click.prevent="show(photo)"
      >
        <img
          class="rounded-2xl cursor-pointer w-full"
          :src="photo"
          :alt="photo"
          @error="filterOut(photo)"
        />
      </div>
    </TransitionGroup>
  </section>
</template>

<style scoped lang="scss">
.photo-list-enter-active,
.photo-list-leave-active {
  transition: all 2s cubic-bezier(0.1, 1, 0, 1);
  transition-delay: var(--delay);
}

.photo-list-enter-from {
  opacity: 0;
  height: 100%;
  transform: translateY(100px);
}
.photo-list-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.photo-list-leave-active {
  position: absolute;
  z-index: -10;
  transition: all 1s cubic-bezier(0.1, 1, 0, 1);
}
.photo-list-leave-to {
  opacity: 0;
  transform: translateY(-50px) scaleY(0%);
}

.photo-list-move {
  transition: transform 2s cubic-bezier(0.1, 1, 0, 1);
}

.photo-list-enter-active,
.photo-list-leave-active,
.photo-list-move {
  flex-basis: auto;
}

.img-div {
  img {
    transition: all 2s cubic-bezier(0.1, 1, 0, 1);
    &:hover {
      rotate: 1deg;
      scale: 98%;
      translate: 0px -10px;
    }
  }
}
</style>

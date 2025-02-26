<script lang="ts" setup>
import { onBeforeMount, PropType, Ref, ref } from "vue";

const props = defineProps({
  intensity: {
    type: Number as PropType<
      0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
    >,
    default: 500,
  },
  color: {
    type: String,
    default: "gray",
  },
  index: {
    type: [Number, String],
  },
  size: {
    type: Number,
    default: 15,
  },
});

const bgIntensity: Ref<number> = ref(0);
const bgColor: Ref<string> = ref("");
const bgSize: Ref<number> = ref(0);

onBeforeMount(() => {
  bgIntensity.value = props.intensity;
  bgColor.value = props.color;
  bgSize.value = props.size;
});
</script>

<template>
  <div
    :class="[`bg-${bgColor}-${bgIntensity}`]"
    class="flex justify-center items-center rounded h-[10px] w-[10px]"
  >
    {{ index }}
  </div>
</template>

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
    default: "blue",
  },
  index: {
    type: [Number, String],
  },
});

const bgIntensity: Ref<number> = ref(0);
const bgColor: Ref<string> = ref("");

onBeforeMount(() => {
  bgIntensity.value = props.intensity;
  bgColor.value = props.color;
});
</script>

<template>
  <div
    :class="[`bg-${bgColor}-${bgIntensity}`]"
    class="flex justify-center items-center h-[15px] w-[15px] rounded"
  >
    {{ index }}
  </div>
</template>

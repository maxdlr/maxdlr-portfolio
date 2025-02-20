<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";

const props = defineProps({
  size: {
    type: Number,
    default: 10,
  },
  intensity: {
    type: Number as PropType<
      0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
    >,
  },
  color: {
    type: String,
    default: "green",
  },
});

const bgIntensity = ref();

onMounted(() => {
  bgIntensity.value = props.intensity;
});
</script>

<template>
  {{ intensity }}
  <!--  <div :class="`w-[${size}px] h-[${size}px] bg-${color}-${intensity}`" />-->
  <div :class="[`bg-blue-${bgIntensity}`, 'w-[30px]', 'h-[30px]']" />
</template>

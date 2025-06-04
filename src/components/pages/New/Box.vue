<script setup lang="ts">
import { PropType } from "vue";

defineProps({
  w: {
    type: {} as PropType<
      | {
          sm?: number | string;
          md?: number | string;
          lg?: number | string;
          xl?: number | string;
          xxl?: number | string;
          _?: number | string;
        }
      | number
      | string
    >,
  },
  h: {
    type: {} as PropType<
      | {
          sm?: number | string;
          md?: number | string;
          lg?: number | string;
          xl?: number | string;
          xxl?: number | string;
          _?: number | string;
        }
      | number
      | string
    >,
  },
  bgColor: { type: String, default: "gray" },
  bgColorIntensity: { type: Number, default: 200 },
});
</script>
<template>
  <div
    :class="[
      `bg-${bgColor}-${bgColorIntensity}`,
      'transition-all',
      w && (typeof w === 'number' || typeof w === 'string')
        ? 'col-span-' + w
        : [
            w && typeof w !== 'number' && w.sm ? 'sm:col-span-' + w.sm : '',
            w && typeof w !== 'number' && w.md ? 'md:col-span-' + w.md : '',
            w && typeof w !== 'number' && w.lg ? 'lg:col-span-' + w.lg : '',
            w && typeof w !== 'number' && w.xl ? 'xl:col-span-' + w.xl : '',
            w && typeof w !== 'number' && w.xxl ? '2xl:col-span-' + w.xxl : '',
            w && typeof w !== 'number' && w._ ? 'col-span-' + w._ : '',
          ],
      h && (typeof h === 'number' || typeof h === 'string')
        ? 'row-span-' + h
        : [
            h && typeof h !== 'number' && h.sm ? 'sm:row-span-' + h.sm : '',
            h && typeof h !== 'number' && h.md ? 'md:row-span-' + h.md : '',
            h && typeof h !== 'number' && h.lg ? 'lg:row-span-' + h.lg : '',
            h && typeof h !== 'number' && h.xl ? 'xl:row-span-' + h.xl : '',
            h && typeof h !== 'number' && h.xxl ? '2xl:row-span-' + h.xxl : '',
            h && typeof h !== 'number' && h._ ? 'row-span-' + h._ : '',
          ],
    ]"
    class="rounded-2xl p-3"
  >
    <slot> fill me </slot>
  </div>
</template>

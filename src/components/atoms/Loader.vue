<script setup lang="ts">
defineProps({
  margin: {
    type: Number,
    default: 12,
    required: false,
  },
  size: {
    type: Number,
    default: 8,
    required: false,
  },
});
</script>

<template>
  <div>
    <div
      :class="`m-${margin} inline-block h h-${size} w-${size} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`"
      role="status"
    >
      <span
        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComponentInstance, PropType } from "vue";

defineProps({
  label: { type: String },
  url: { type: String },
  icon: { type: {} as PropType<ComponentInstance<any>> },
  variant: {
    type: String as PropType<
      "default" | "ghost" | "primary" | "secondary" | "danger" | "text" | "link"
    >,
    default: "default",
  },
  extraClass: { type: String },
});
</script>

<template>
  <div class="inline">
    <a
      v-if="url"
      :class="`uk-button uk-button-${variant} ${extraClass}`"
      :href="url"
      target="_blank"
    >
      <component :is="icon" v-if="icon" />
      <span v-if="label">{{ label }}</span>
    </a>
    <button v-else :class="`uk-button uk-button-${variant} ${extraClass}`">
      <component :is="icon" v-if="icon" />
      <span v-if="label">{{ label }}</span>
    </button>
  </div>
</template>

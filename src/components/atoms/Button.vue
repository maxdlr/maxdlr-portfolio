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
  extraClass: { type: String, default: "" },
  target: {
    type: String as PropType<"_blank">,
    required: false,
  },
});
</script>

<template>
  <div class="inline">
    <a
      v-if="url"
      :class="`uk-button uk-button-${variant} ${extraClass} hover:bg-gray-900 hover:text-white transition-all active:bg-gray-600`"
      :href="url"
      :target="target ?? ''"
    >
      <slot>
        <component :is="icon" v-if="icon" />
        <span v-if="label">{{ label }}</span>
      </slot>
    </a>
    <button v-else :class="`uk-button uk-button-${variant} ${extraClass}`">
      <slot>
        <component :is="icon" v-if="icon" />
        <span v-if="label">{{ label }}</span>
      </slot>
    </button>
  </div>
</template>

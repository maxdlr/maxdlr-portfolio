<script setup lang="ts">
import { PropType } from "vue";
import { BlogArticle } from "../../interface/BlogArticle.ts";
import _ from "lodash";
import { marked } from "marked";

defineProps({
  article: { type: {} as PropType<BlogArticle>, required: true },
});
</script>

<template>
  <div class="h-full">
    <a
      class="uk-button uk-button-default h-full"
      :href="`#${article.id}`"
      uk-toggle
      >{{ $t("peak") }}</a
    >

    <div :id="article.id" class="uk-flex-top" uk-modal>
      <div
        class="uk-modal-body uk-margin-auto-vertical uk-modal-dialog bg-white"
      >
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <p
          v-html="
            marked(
              _.truncate(article.text, {
                length: 350,
                omission: '...',
              }),
            )
          "
        />
      </div>
    </div>
  </div>
</template>

import {
  BeforeFetchContext,
  createFetch,
  OnFetchErrorContext,
} from "@vueuse/core";

const outlineFetch = createFetch({
  baseUrl: import.meta.env.VITE_DOCS_BASE_API_URL,
  options: {
    async beforeFetch({ options, url }: BeforeFetchContext) {
      options.headers = {
        ...options.headers,
        Authorization: "Bearer " + import.meta.env.VITE_DOCS_TOKEN,
      };
      return { options, url };
    },
    async onFetchError(ctx: OnFetchErrorContext) {
      if (ctx.data) {
        throw new Error(ctx.data.message);
      }
      return ctx;
    },
  },
});

export const OutlineService = {
  outlineFetch,
};

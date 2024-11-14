export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'franken-ui/postcss/sort-media-queries': {sort: 'mobile-first'},
    'franken-ui/postcss/combine-duplicated-selectors' : {removeDuplicatedProperties: true}
  },
};

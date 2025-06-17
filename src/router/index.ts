import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/pages/Home.vue";
import Blog from "../components/pages/Blog/Blog.vue";
import BlogArticle from "../components/pages/Blog/BlogArticle.vue";
import Photos from "../components/pages/Photo/Photos.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/photo",
    name: "Photos",
    component: Photos,
  },
  {
    path: "/blog",
    name: "Blog",
    component: Blog,
  },
  {
    path: "/article/:id",
    name: "BlogArticle",
    component: BlogArticle,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  switch (to.path) {
    case "/in":
      {
        window.location.href = "https://www.linkedin.com/in/maxdlr/";
      }
      break;
    case "/reco":
      {
        window.location.href =
          "https://www.linkedin.com/in/maxdlr/details/recommendations/?detailScreenTabIndex=0";
      }
      break;
    case "/gh":
      {
        window.location.href = "https://www.github.com/maxdlr";
      }
      break;
    case "/cv":
      {
        window.location.pathname = "/cv.pdf";
      }
      break;
  }
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/pages/Home.vue";
import Blog from "../components/pages/Blog/Blog.vue";
import BlogArticle from "../components/pages/Blog/BlogArticle.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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

export default router;

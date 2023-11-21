import { createWebHistory, createRouter } from "vue-router";
import StartScreen from "../components/StartScreen.vue";
import Editor from "../components/Editor.vue";

const routes = [
  {
    path: "/",
    name: "Start",
    component: StartScreen,
  },
  {
    path: "/editor/",
    name: "Editor",
    component: Editor,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
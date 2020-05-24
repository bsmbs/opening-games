import Vue from "vue";
import VueRouter from "vue-router";
import Menu from "../views/Menu.vue";
import SongGame from '../views/SongGame'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Menu",
    component: Menu
  },
  {
    path: "/game",
    name: "Game",
    component: SongGame
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

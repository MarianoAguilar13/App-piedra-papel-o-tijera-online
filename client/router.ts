import { Router } from "../node_modules/@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "welcome-page" },
  { path: "/iniciar-sesion", component: "iniciar-sesion-page" },
  { path: "/crear-cuenta", component: "crear-cuenta-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/ingresar-codigo-room", component: "ingresar-codigo-room-page" },
  { path: "/opciones-rooms", component: "opciones-rooms-page" },
  { path: "/game", component: "game-page" },
  { path: "/result", component: "result-page" },
  { path: "/wait-room", component: "wait-room-page" },
  { path: "/wait-result", component: "wait-result-page" },
  { path: "/result-score", component: "result-score-page" },
]);

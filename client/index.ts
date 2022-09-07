import "./pages/welcome/index";
import "./pages/instructions/index";
import "./pages/crear-cuenta/index";
import "./pages/iniciar-sesion/index";
import "./pages/ingresar-codigo-room/index";
import "./pages/opciones-rooms/index";
import "./pages/game/index";
import "./pages/result/index";
import "./pages/wait-room/index";
import "./pages/wait-result/index";
import "./pages/result-score/index";
import "./router";
import { state } from "./state";

import { init as initButtonNormalEl } from "./components/boton-normal-el";
import { init as initPapelEl } from "./components/papel-el";
import { init as initPiedraEl } from "./components/piedra-el";
import { init as initTijerasEl } from "./components/tijeras-el";

(function () {
  initButtonNormalEl();
  initPapelEl();
  initPiedraEl();
  initTijerasEl();

  state.init();
})();

/* El localStorage, "history" se suscribe en el state, para que este
  el history se mantenga actualizado con el historial 


  state.subscribe(() => {
    const actualState = state.getState();
    const historyStingifeado = JSON.stringify(actualState.history);
    localStorage.setItem("history", historyStingifeado);

    console.log(localStorage.getItem("history"));
  });

/*Cuando ingresa a la pag si tiene un historial guardao el localstorage
  entonces lo carga al state para que tenga el historial de jugadas actualizado */
/*  if (localStorage.getItem("history") == undefined) {
  } else {
    let historialDeJugadas = {
      currentGame: {
        computerPlay: "",
        myPlay: "",
      },

      history: JSON.parse(localStorage.getItem("history")),
    };
    state.setState(historialDeJugadas);
  }*/

/* Inicia el initRouter para cargar los elementos*/
/*
  const root = document.querySelector(".root");
  initRouter(root);
})();
*/

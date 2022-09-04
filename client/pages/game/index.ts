import { state } from "../../state";
import { Router } from "../../../node_modules/@vaadin/router";

type Jugada = "piedra" | "papel" | "tijeras";

function timerJugada() {
  let counter = 0;

  //este div me mostrara en pantalla la cuenta regresiva
  const cuentaRegresiva = document.querySelector(
    ".container-cuenta-regresiva"
  ) as any;

  const intervalId = setInterval(() => {
    counter++;

    //Cuenta regresiva
    /*Creo que el error esta aca, deberia comenzar de 0
    para que no me cuente una jugada extra */

    if (counter == 1) {
      cuentaRegresiva.textContent = "5";
    }
    if (counter == 2) {
      cuentaRegresiva.textContent = "4";
    }
    if (counter == 3) {
      cuentaRegresiva.textContent = "3";
    }
    if (counter == 4) {
      cuentaRegresiva.textContent = "2";
    }
    if (counter == 5) {
      cuentaRegresiva.textContent = "1";
    }

    /* Si pasan mas de 3 segundos osea 4 se corta la funcion
    y vuelve a instrucciones porque si llego a 4 significa
    que no eligieron antes de los 4seg */
    if (counter > 5) {
      clearInterval(intervalId);
      Router.go("/wait-result");
    }

    const piedraEl = document.querySelector(".piedra-img") as any;

    piedraEl.addEventListener("click", (e) => {
      e.preventDefault();

      /*cuando hace click, la jugada elegida, se guarda en el state
      y calcula la jugada de la compu con la funcion computerJuego
      luego guarda la jugada en ultima jugada y pushea la nueva jugada
      en el state de history*/

      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = "piedra";
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();

      /*Cuando clickea la mano, termina el conteo y va a resultados
      la logica del state queda en el elemento piedra */

      Router.go("/wait-result");
      clearInterval(intervalId);
    });

    const tijerasEl = document.querySelector(".tijeras-img") as any;

    tijerasEl.addEventListener("click", (e) => {
      e.preventDefault();
      /*cuando hace click, la jugada elegida, se guarda en el state
      y calcula la jugada de la compu con la funcion computerJuego
      luego guarda la jugada en ultima jugada y pushea la nueva jugada
      en el state de history*/

      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = "tijeras";
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();

      /*Cuando clickea la mano, termina el conteo y va a resultados
      la logica del state queda en el elemento tijeras */

      Router.go("/wait-result");
      clearInterval(intervalId);
    });

    const papelEl = document.querySelector(".papel-img") as any;

    papelEl.addEventListener("click", (e) => {
      e.preventDefault();
      /*cuando hace click, la jugada elegida, se guarda en el state
      y calcula la jugada de la compu con la funcion computerJuego
     luego guarda la jugada en ultima jugada y pushea la nueva jugada
     en el state de history*/

      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = "papel";
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();

      /*Cuando clickea la mano, termina el conteo y va a resultados
  la logica del state queda en el elemento papel */

      Router.go("/wait-result");
      clearInterval(intervalId);
    });
  }, 1000);
}

class Game extends HTMLElement {
  connectedCallback() {
    this.render();

    timerJugada();
  }

  render() {
    this.innerHTML = `
                <div class="container">
                <h3 class="texto-instructions">Elija su opción.</h3>
                    <h1 class="container-cuenta-regresiva"></h1>
                    <tijeras-el class= "tijeras-img"></tijeras-el>                
                    <piedra-el class= "piedra-img"></piedra-el>
                    <papel-el class= "papel-img"></papel-el>

                </div>
            `;

    let style = document.createElement("style");
    style.textContent = `
                        .container {
                            height: 100vh;
                            width: 100%;
                            padding: 0 30px;
                        }
                        
                        @media (min-width: 600px) {
                            .container {
                            height: 80vh;
                            width: 450px;
                            margin: 0 auto;
                            }
                        }

                        .texto-instructions {
                          font-weight: 700;
                          font-size: 36px;
                          text-align: center;
                          color: black;
                          margin-top: 40px;
                          margin-bottom: 60px;
                      }

                        .container-cuenta-regresiva{
                            font-family: "Poppins", sans-serif;
                            font-weight: bold;
                            font-size: 256px;
                            text-align: center;
                            color: var(--titulos);
                            margin-top: 100px;
                        }

                        .piedra-img {
                            height: 150px;
                            position: fixed;
                            bottom: -20px;
                            left: 160px;
                        }
                        @media (min-width: 600px) {
                          .piedra-img {
                            left: 640px;
                          }
                        }
    
                        .papel-img {
                            height: 150px;
                            position: fixed;
                            bottom: -20px;
                            left: 275px;
                        }
                        @media (min-width: 600px) {
                          .papel-img {
                            left: 755px;
                          }
                        }
    
                        .tijeras-img {
                            height: 150px;
                            position: fixed;
                            bottom: -20px;
                            left: 50px;
                        }
                        @media (min-width: 600px) {
                          .tijeras-img {
                            left: 530px;
                          }
                        }
                        
                      `;
    this.appendChild(style);
  }
}
customElements.define("game-page", Game);

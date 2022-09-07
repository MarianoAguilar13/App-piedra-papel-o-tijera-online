import { state } from "../../state";
import { Router } from "../../../node_modules/@vaadin/router";

type Jugada = "piedra" | "papel" | "tijeras";

function timerJugada() {
  let counter = 0;

  const intervalId = setInterval(() => {
    counter++;

    const cuentaRegresiva = document.querySelector(
      ".container-cuenta-regresiva"
    ) as any;

    //Cuenta regresiva

    if (counter == 1) {
      cuentaRegresiva.textContent = "3";
    }
    if (counter == 2) {
      cuentaRegresiva.textContent = "2";
    }
    if (counter == 3) {
      cuentaRegresiva.textContent = "1";
    }

    // Si pasan mas de 3 se elige una opción de manera automatica
    if (counter > 3) {
      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = state.jugadaRandom();
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();
      clearInterval(intervalId);
      Router.go("/wait-result");
    }

    const piedraEl = document.querySelector(".piedra-img") as any;

    piedraEl.addEventListener("click", (e) => {
      e.preventDefault();

      /*Cuando se hace click en la opcion, se carga la jugada al state
      y se pushea la jugada a la rtdb 
      */

      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = "piedra";
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();

      Router.go("/wait-result");
      clearInterval(intervalId);
    });

    const tijerasEl = document.querySelector(".tijeras-img") as any;

    tijerasEl.addEventListener("click", (e) => {
      e.preventDefault();
      /*Cuando se hace click en la opcion, se carga la jugada al state
      y se pushea la jugada a la rtdb 
      */

      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = "tijeras";
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();

      Router.go("/wait-result");
      clearInterval(intervalId);
    });

    const papelEl = document.querySelector(".papel-img") as any;

    papelEl.addEventListener("click", (e) => {
      e.preventDefault();
      /*Cuando se hace click en la opcion, se carga la jugada al state
      y se pushea la jugada a la rtdb 
      */

      let myJugada: Jugada;
      const newData = state.getState();
      myJugada = "papel";
      newData.usersData.myPlay = myJugada;
      state.setState(newData);
      state.pushPlay();

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
    const dataCs = state.getState();
    const roomCod = dataCs.usersData.roomIdCorto;

    this.innerHTML = `
                <div class="container">
                <p class="room-cod"> codigo-room: ${roomCod}</p>
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

                        .room-cod{
                          font-family: "Poppins", sans-serif;
                          font-weight: 700;
                          position: fixed;
                          font-size: 24px;
                          top: 20px;
                          left: 20px;
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

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
      cuentaRegresiva.textContent = "2";
    }
    if (counter == 2) {
      cuentaRegresiva.textContent = "1";
    }
    if (counter == 3) {
      cuentaRegresiva.textContent = "0";
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
    this.innerHTML = `
                <div class="container">  
                    <h3 class="texto-instructions">Elija su opción.</h3>
                    <h1 class="container-cuenta-regresiva">3</h1>
                    <div class="container-opciones">
                      <tijeras-el class= "tijeras-img"></tijeras-el>                
                      <piedra-el class= "piedra-img"></piedra-el>
                      <papel-el class= "papel-img"></papel-el>
                    </div>
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
                          margin-top: 60px;
                          margin-bottom: 20px;
                      }

                        .container-cuenta-regresiva{
                            font-family: "Poppins", sans-serif;
                            font-weight: bold;
                            font-size: 128px;
                            text-align: center;
                            color: var(--titulos);
                            margin-top: 120px;
                        }

                        .room-cod{
                          font-family: "Poppins", sans-serif;
                          font-weight: 700;
                          position: fixed;
                          font-size: 24px;
                          top: 20px;
                          left: 20px;
                      }

                      .container-opciones{
                        min-height: 120px;
                        width: 100%;                   
                        padding: 0 10px;
                        margin-top: 120px; 
                        display: flex;
                        flex-direction: row;
                        align-self: flex-end;
                        justify-content: center;
                      }
                      
                      .piedra-img {
                          height: 150px;
                          padding-right: 30px;
                      }
                      @media (min-width: 600px) {
                        .piedra-img {
                          
                        }
                      }
  
                      .papel-img {
                          height: 150px;
                          
                      }
                      @media (min-width: 600px) {
                        .papel-img {
                          
                        }
                      }
  
                      .tijeras-img {
                          height: 150px;
                          padding-right: 30px;
                      }
                      @media (min-width: 600px) {
                        .tijeras-img {
                          
                        }
                      }
                      `;
    this.appendChild(style);
  }
}
customElements.define("game-page", Game);

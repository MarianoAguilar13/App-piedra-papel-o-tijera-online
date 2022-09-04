import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

function timerJugada() {
  let counter = 0;

  const intervalId = setInterval(() => {
    counter++;

    const cuentaRegresiva = document.querySelector(
      ".container-cuenta-regresiva"
    ) as any;

    //Cuenta regresiva
    /*Creo que el error esta aca, deberia comenzar de 0
    para que no me cuente una jugada extra */

    const ambosStart = state.playersStart();
    if (ambosStart) {
      clearInterval(intervalId);
      Router.go("/game");
    }
    if (counter == 1) {
      cuentaRegresiva.textContent = "10";
    }
    if (counter == 2) {
      cuentaRegresiva.textContent = "9";
    }
    if (counter == 3) {
      cuentaRegresiva.textContent = "8";
    }
    if (counter == 4) {
      cuentaRegresiva.textContent = "7";
    }
    if (counter == 5) {
      cuentaRegresiva.textContent = "6";
    }
    if (counter == 6) {
      cuentaRegresiva.textContent = "5";
    }
    if (counter == 7) {
      cuentaRegresiva.textContent = "4";
    }
    if (counter == 8) {
      cuentaRegresiva.textContent = "3";
    }
    if (counter == 9) {
      cuentaRegresiva.textContent = "2";
    }
    if (counter == 10) {
      cuentaRegresiva.textContent = "1";
    }
    if (counter == 11) {
      cuentaRegresiva.textContent = "0";
    }
    /* Si pasan mas de 3 segundos osea 4 se corta la funcion
    y vuelve a instrucciones porque si llego a 4 significa
    que no eligieron antes de los 4seg */
    if (counter > 10) {
      clearInterval(intervalId);
      Router.go("/instructions");
    }
  }, 1000);
}

class WaitRoom extends HTMLElement {
  connectedCallback() {
    this.render();

    timerJugada();
  }

  render() {
    this.innerHTML = `
              <div class="container">
                  <h3 class="texto-instructions">Esperando al oponente.</h3>
                  <h1 class="container-cuenta-regresiva"></h1>
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

                      .container-cuenta-regresiva{
                        font-family: "Poppins", sans-serif;
                        font-weight: bold;
                        font-size: 256px;
                        text-align: center;
                        color: var(--titulos);
                        margin-top: 100px;
                    }
                      
                      .texto-instructions {
                          font-family: "Poppins", sans-serif;
                          font-weight: 700;
                          font-size: 36px;
                          text-align: center;
                          color: black;
                          margin-top: 40px;
                          margin-bottom: 60px;
                      }
                      
                      @media (min-width: 600px) {
                          .texto-instructions {               
                          font-size: 36px;                         
                          margin-top: 40px;
                          margin-bottom: 60px;
                          }
                      } 
                      
                      .piedra-img {
                        height: 150px;
                        position: fixed;
                        bottom: -50px;
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
                        bottom: -50px;
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
                        bottom: -50px;
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
customElements.define("wait-room-page", WaitRoom);

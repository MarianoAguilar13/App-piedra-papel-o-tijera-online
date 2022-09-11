import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

function timerEspera() {
  let counter = 0;

  const intervalId = setInterval(() => {
    counter++;

    const containerInstruction = document.querySelector(
      ".texto-instructions"
    ) as any;

    const cuentaRegresiva = document.querySelector(
      ".container-cuenta-regresiva"
    ) as any;

    //Cuenta regresiva

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
      containerInstruction.textContent =
        "Calculando el ganador de la partida...";
      cuentaRegresiva.textContent = "7";
    }
    if (counter == 5) {
      cuentaRegresiva.textContent = "6";
      const cs = state.getState();

      //aca voy a pushear el history, el problema es que lo necesito
      //pushear una vez por eso se me ocurrio esta forma para que si o si
      //a cualquiera de los 2 le muestre el resultado
      if (cs.usersData.player == "playerUno") {
        state.pushHistoryDB(() => {
          console.log("estoy pusheando el history");
        });
      }
    }
    if (counter == 6) {
      cuentaRegresiva.textContent = "5";
    }
    if (counter == 7) {
      containerInstruction.textContent =
        "Calculando el historial de los jugadores...";
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

    /* Si pasan mas de 3 segundos osea 4 se corta la funcion
    y vuelve a instrucciones porque si llego a 4 significa
    que no eligieron antes de los 4seg */
    if (counter > 10) {
      clearInterval(intervalId);
      Router.go("/result");
    }
  }, 1000);
}

class WaitResult extends HTMLElement {
  connectedCallback() {
    this.render();
    timerEspera();
  }

  render() {
    this.innerHTML = `
              <div class="container">
                  <h3 class="texto-instructions">Esperando a que el oponente termine de elegir su opción...</h3>
                  
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
                        font-weight: bold;
                        font-size: 256px;
                        text-align: center;
                        color: var(--titulos);
                        margin-top: 100px;
                    }
                      
                      .texto-instructions {
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
customElements.define("wait-result-page", WaitResult);

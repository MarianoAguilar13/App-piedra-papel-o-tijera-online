import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
  connectedCallback() {
    this.render();

    //aca me conecto a la RTDB
    state.conectRoomRt();

    state.pushDatosInicialesRtdb(() => {
      console.log("todo ok");
      const boton = document.querySelector(".boton") as any;
      boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        state.pushStart(() => {
          //const ambosStart = state.playersStart();
          Router.go("/wait-room");
        });
        /*
        if (ambosStart) {
            Router.go("/game");
          } else {
              state.subscribe(() => {
              const ambosStart = state.playersStart();
              if (ambosStart) {
                Router.go("/game");
              }
            });
          }*/
      });
    });
  }

  render() {
    this.innerHTML = `
              <div class="container">
                  <h3 class="texto-instructions">Presioná jugar
                  y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</h3>
                  <button-normal-el class="boton"> ¡Jugar! </button-normal-el>
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
    /*
    const boton = document.querySelector(".boton") as any;
    boton.addEventListener("click", (evento) => {
      evento.preventDefault();
    });*/
  }
}
customElements.define("instructions-page", Instructions);

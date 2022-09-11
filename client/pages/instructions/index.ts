import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
  connectedCallback() {
    this.render();

    //aca me conecto a la RTDB
    state.conectRoomRt();

    //ingreso los datos iniciales a la rtdb
    state.pushDatosInicialesRtdb(() => {
      const boton = document.querySelector(".boton") as any;
      boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        //si hizo click en el boton jugar, entonces pongo a start en start
        //lo que indica que esta listo para jugar
        state.pushStart(() => {
          Router.go("/wait-room");
        });
      });
    });
  }

  render() {
    const dataCs = state.getState();
    const roomCod = dataCs.usersData.roomIdCorto;

    this.innerHTML = `
              <div class="container">
                  <p class="room-cod"> codigo-room: ${roomCod}</p>
                  <p class="texto-instructions">Presioná jugar
                  y elegí: piedra, papel o tijera antes de que pasen los 3 segundos, pasados los 3 segundos se eligirá una opción al azar.</p>
                  <button-normal-el class="boton"> ¡Jugar! </button-normal-el>
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
                          font-family: "Poppins", sans-serif;
                          font-weight: 700;
                          font-size: 28px;
                          text-align: center;
                          color: black;
                          margin-top: 20px;
                          margin-bottom: 20px;
                      }
                      
                      @media (min-width: 600px) {
                          .texto-instructions {               
                          font-size: 28px;                         
                          margin-top: 20px;
                          margin-bottom: 20px;
                          }
                      }
                      
                      .room-cod{
                        font-family: "Poppins", sans-serif;
                        font-weight: 700;
                        font-size: 28px;
                        text-align: center;
                        color: black;
                        margin-top: 10px;
                       
                      }

                      @media (min-width: 600px) {
                        .room-cod {               
                        font-size: 28px;                         
                        margin-top: 20px;
                        margin-bottom: 20px;
                        }
                    }
                    
                      
                    .container-opciones{
                      min-height: 120px;
                      width: 100%;                   
                      padding: 0 10px;
                      margin-top: 80px; 
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
customElements.define("instructions-page", Instructions);

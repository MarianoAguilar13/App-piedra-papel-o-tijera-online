import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class IngresarCodigoRoom extends HTMLElement {
  connectedCallback() {
    this.render();

    const botonIngresarCod = document.querySelector(".boton") as any;
    botonIngresarCod.addEventListener("click", (e) => {
      botonIngresarCod.style.visibility = "hidden";
    });

    const form = this.querySelector(".form-user");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;

        const roomIdCorto = target.roomid.value;

        //cuando envio el formulario guardo el dato del roomIdCorto
        //dentro del state
        state.setRoomIdCorto(roomIdCorto);
        console.log(roomIdCorto);

        //si existe la room con el id ingresado, obtengo el id de la room
        //de la rtdb, si obtengo ese roomIdLargo entonces veo si es el player 1
        //osea el owner de la room o si es el player 2 jugado invitado
        //luego pushEnd marca que start no se encuentra en start
        state.roomIdLargo(() => {
          const dataCs = state.getState();
          if (dataCs.usersData.roomIdLargo) {
            state.whoIsPlayer(() => {
              state.pushEnd();
              Router.go("./instructions");
            });
          } else {
            alert(
              "La room a la que desea entrar no existe, cree una nueva o verifique que haya ingresada el código correcto."
            );
            Router.go("./opciones-rooms");
          }
        });
      });
    }
  }

  render() {
    this.innerHTML = `
            <h1 class="titulo">Entrar a la sala</h1>  
            <div class="container">
              <div class="container-form">
                <form class="form-user">
                  <div class="container-input">
                    <label class="label">Código</label>
                    <input class="input" name="roomid" type="text" />
                  </div>
                  <button class="boton"> Ingresar código </button>
                </form>
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
                    
                    .titulo {
                        font-family: "Poppins", sans-serif;
                        font-weight: bold;
                        font-size: 72px;
                        text-align: center;
                        color: var(--titulos);
                        margin-top: 30px;
                        margin-bottom: 30px;
                    }
                    
                    @media (min-width: 600px) {
                        .titulo {
                        font-family: "Poppins", sans-serif;
                        font-weight: bold;
                        font-size: 60px;
                        text-align: center;
                        color: var(--titulos);
                        margin-top: 30px;
                        margin-bottom: 20px;
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

                    .boton {
                      border: solid 5px;
                      border-color: var(--azul-borde);
                      border-radius: 10px;
                      height: 80px;
                      width: 100%;
                      font-family: "Odibee Sans", cursive;
                      font-weight: 400;
                      font-size: 36px;
                      background-color: var(--azul-boton);
                      color: whitesmoke;
                      margin-top: 20px;
                  }

                    .container-form {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-around;
                      width: 300px;
                      margin: auto;
                    }
                    
                    .titulo {
                      font-weight: 700;
                      font-size: 48px;
                      text-align: center;
                    }
                    
                    .form-user {
                      display: flex;
                      justify-content: center;
                      flex-direction: column;
                      width: 100%;
                      min-height: 200px;
                    }
                    
                    .container-input {
                      padding: auto 30px;
                    }
                    
                    .label {
                      font-size: 24px;
                      font-weight: 700;
                    }
                    
                    .input {
                      border: solid 1px;
                      border-color: black;
                      border-radius: 10px;
                      height: 40px;
                      width: 100%;
                      font-size: 24px;
                      text-align: start;
                    }
                  `;
    this.appendChild(style);
  }
}
customElements.define("ingresar-codigo-room-page", IngresarCodigoRoom);

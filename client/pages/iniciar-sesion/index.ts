import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class IniciarSesion extends HTMLElement {
  connectedCallback() {
    this.render();

    const botonInicio = document.querySelector(".boton") as any;
    botonInicio.addEventListener("click", (e) => {
      botonInicio.style.visibility = "hidden";
    });

    const form = this.querySelector(".form-user");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const target = e.target as any;

        const email = target.email.value;

        console.log(email);

        //Primero se guarda en el state el nombre y email que fueron
        //ingresados en el formulario

        state.setEmail(email);

        //Ahora vamos a autorizar al usuario si existe en la db
        //si existe el state deberia guardar el idUser, que se consiguio
        //a traves del state que hizo una llamada a la api para ver
        //si esta

        state.auth(() => {
          const cs = state.getState();
          //si existe entonces vamos a la pag de "/room"
          if (cs.usersData.idUser) {
            state.getSetName(() => {
              Router.go("/opciones-rooms");
            });
          } else {
            //sino existe le decimos al usuario que no tiene una cuenta creada
            //y lo redirecciono hacia la pag encargada de crear una cuenta
            alert(
              "Su email no esta registrado, por favor cree una cuenta para continuar"
            );
            Router.go("/crear-cuenta");
          }
        });

        //el nombre que se envia en el formulario, lo seteo en el
        //state, para que se guarde en la data
      });
    }
  }

  render() {
    this.innerHTML = `
            <h1 class="titulo">Iniciar sesión</h1>  
            <div class="container">
              <div class="container-form">
                <form class="form-user">
                  <div class="container-input">
                    <label class="label">Email</label>
                    <input class="input" type="text" name="email" />
                  </div>
                  <button class="boton"> Iniciar sesión </button>
                </form>
              </div>
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

    /*
    const boton = document.querySelector(".boton") as any;

    boton.addEventListener("click", (evento) => {
      evento.preventDefault();
      Router.go("./opciones-rooms");
    });*/
  }
}
customElements.define("iniciar-sesion-page", IniciarSesion);

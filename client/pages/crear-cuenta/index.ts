import { Router } from "../../../node_modules/@vaadin/router";
import { state } from "../../state";

class CrearCuenta extends HTMLElement {
  connectedCallback() {
    this.render();

    const botonCrear = document.querySelector(".boton") as any;
    botonCrear.addEventListener("click", (e) => {
      botonCrear.style.visibility = "hidden";
    });

    const form = this.querySelector(".form-user");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;

        const nombre = target.nombre.value;
        const email = target.email.value;

        if (nombre == "" || nombre[0] == " ") {
          alert(
            "Su nombre esta en blanco o comienza con un ' ' (espacio), por favor ingrese un nombre válido"
          );
          Router.go("/");
        } else {
          //Primero se guarda en el state el nombre y email que fueron
          //ingresados en el formulario

          state.setNombreEmail(nombre, email);

          //Ahora usamos el metodo crearCuenta del state para crear el nuevo
          //usuario, con el nombre y email
          state.crearCuenta(() => {
            //si el email no existe, entonces se envia un msj y una alerta al usuario
            //y si existe se crea la cuenta y lo redirecciona a la pag iniciar-sesion
            const cs = state.getState();
            if (cs.usersData.email) {
              alert(
                "Usted ya se encuentra registrado, ingrese sesión con este mismo email."
              );
              Router.go("/iniciar-sesion");
            } else {
              alert(
                "Se olvido de ingresar un email valido, por favor complete el formulario nuevamente con los datos correctos"
              );
              Router.go("/crear-cuenta");
            }
          });
        }
      });
    }
  }

  render() {
    this.innerHTML = `
            <h1 class="titulo">Crear Cuenta</h1>  
            <div class="container">
              <div class="container-form">
                <form class="form-user">
                  <div class="container-input">
                    <label class="label">Email</label>
                    <input class="input" type="text" name="email" />
                  </div>
                  <div class="container-input">
                    <label class="label">Tu nombre</label>
                    <input class="input" type="text" name="nombre" />
                  </div>
                  <button class="boton"> Crear Cuenta </button>
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
customElements.define("crear-cuenta-page", CrearCuenta);

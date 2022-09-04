import { Router } from "../../../node_modules/@vaadin/router";

class Welcome extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
            <div class="container">
                <h1 class="titulo">Piedra, Papel o Tijera</h1>
                <button-normal-el class="boton-iniciar"> Iniciar sesión </button-normal-el>
                <button-normal-el class="boton-crear"> Nueva cuenta </button-normal-el>
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
                  `;
    this.appendChild(style);

    const botonIniciar = document.querySelector(".boton-iniciar") as any;
    const botonCrear = document.querySelector(".boton-crear") as any;

    botonIniciar.addEventListener("click", (evento) => {
      evento.preventDefault();
      Router.go("/iniciar-sesion");
    });

    botonCrear.addEventListener("click", (evento) => {
      evento.preventDefault();
      Router.go("/crear-cuenta");
    });
  }
}
customElements.define("welcome-page", Welcome);

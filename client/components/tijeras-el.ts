import { state } from "../state";
import { computerJuego } from "../computerPlay";

export function init() {
  type Jugada = "piedra" | "papel" | "tijeras";

  class TijerasEl extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    shadow = this.attachShadow({ mode: "open" });

    render() {
      //creo el style, que solo puede ser usados por elementos del header-el
      let style = document.createElement("style");
      style.textContent = `                       
                          
                      `;

      this.shadow.innerHTML = `
            <img class="tijeras-img" src="https://marianoaguilar13.github.io/imagenes-proyecto-final/tijera.svg" alt="tijeras" />
        `;

      this.shadow.appendChild(style);
    }
  }
  customElements.define("tijeras-el", TijerasEl);
}

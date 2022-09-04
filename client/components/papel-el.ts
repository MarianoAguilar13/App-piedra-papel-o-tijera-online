import { state } from "../state";
import { computerJuego } from "../computerPlay";

export function init() {
  type Jugada = "piedra" | "papel" | "tijeras";

  class PapelEl extends HTMLElement {
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
        <img class="papel-img" src="https://marianoaguilar13.github.io/imagenes-proyecto-final/papel.svg" alt="papel" />
    `;

      this.shadow.appendChild(style);
    }
  }
  customElements.define("papel-el", PapelEl);
}

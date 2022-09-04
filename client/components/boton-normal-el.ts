export function init() {
  class ButtonNormalEl extends HTMLElement {
    constructor() {
      super();
      this.render();
    }

    shadow = this.attachShadow({ mode: "open" });

    render() {
      //creo el style, que solo puede ser usados por elementos del header-el
      let style = document.createElement("style");
      style.textContent = `
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
                        
                `;

      const buttonEl = document.createElement("button");
      buttonEl.classList.add("boton");
      buttonEl.textContent = this.textContent;

      this.shadow.appendChild(buttonEl);

      this.shadow.appendChild(style);
    }
  }
  customElements.define("button-normal-el", ButtonNormalEl);
}

import { state } from "../../state";
import { Router } from "../../../node_modules/@vaadin/router";

function resultadosJugadas() {
  const newData = state.getState();

  const currentGame = newData.currentGame;

  const div = document.querySelector(".container-result") as any;

  /*
    Me fijo si el usuario es el playerUno o el playerDos
    para mostrar las jugadas desde la perspectiva de cada jugador
    */
  if (newData.usersData.player == "playerUno") {
    if (currentGame.playerDos.choice == "piedra") {
      const jugadaCompuImgEl = document.createElement("img");
      jugadaCompuImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/piedra-invertido.png";
      jugadaCompuImgEl.classList.add("jugada-playerVs");

      div.appendChild(jugadaCompuImgEl);
    }
    if (currentGame.playerDos.choice == "papel") {
      const jugadaCompuImgEl = document.createElement("img");
      jugadaCompuImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/papel-invertido.png";
      jugadaCompuImgEl.classList.add("jugada-playerVs");

      div.appendChild(jugadaCompuImgEl);
    }
    if (currentGame.playerDos.choice == "tijeras") {
      const jugadaCompuImgEl = document.createElement("img");
      jugadaCompuImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/tijera-invertido.png";
      jugadaCompuImgEl.classList.add("jugada-playerVs");

      div.appendChild(jugadaCompuImgEl);
    }

    //aca inserto entre la jugada del player 1 y el 2, un boton para
    //ver el resultado de quien gano y el historial
    const botonVerScoreEl = document.createElement("button");
    botonVerScoreEl.classList.add("boton");
    botonVerScoreEl.textContent = "Ver Score";
    div.appendChild(botonVerScoreEl);

    if (currentGame.playerUno.choice == "piedra") {
      const jugadaPlayerImgEl = document.createElement("img");
      jugadaPlayerImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/piedra.svg";
      jugadaPlayerImgEl.classList.add("jugada-player");

      div.appendChild(jugadaPlayerImgEl);
    }
    if (currentGame.playerUno.choice == "papel") {
      const jugadaPlayerImgEl = document.createElement("img");
      jugadaPlayerImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/papel.svg";
      jugadaPlayerImgEl.classList.add("jugada-player");

      div.appendChild(jugadaPlayerImgEl);
    }
    if (currentGame.playerUno.choice == "tijeras") {
      const jugadaPlayerImgEl = document.createElement("img");
      jugadaPlayerImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/tijera.svg";
      jugadaPlayerImgEl.classList.add("jugada-player");

      div.appendChild(jugadaPlayerImgEl);
    }
  } else {
    if (currentGame.playerUno.choice == "piedra") {
      const jugadaCompuImgEl = document.createElement("img");
      jugadaCompuImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/piedra-invertido.png";
      jugadaCompuImgEl.classList.add("jugada-playerVs");

      div.appendChild(jugadaCompuImgEl);
    }
    if (currentGame.playerUno.choice == "papel") {
      const jugadaCompuImgEl = document.createElement("img");
      jugadaCompuImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/papel-invertido.png";
      jugadaCompuImgEl.classList.add("jugada-playerVs");

      div.appendChild(jugadaCompuImgEl);
    }
    if (currentGame.playerUno.choice == "tijeras") {
      const jugadaCompuImgEl = document.createElement("img");
      jugadaCompuImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/tijera-invertido.png";
      jugadaCompuImgEl.classList.add("jugada-playerVs");

      div.appendChild(jugadaCompuImgEl);
    }

    const botonVerScoreEl = document.createElement("button");
    botonVerScoreEl.classList.add("boton");
    botonVerScoreEl.textContent = "Ver Score";
    div.appendChild(botonVerScoreEl);

    if (currentGame.playerDos.choice == "piedra") {
      const jugadaPlayerImgEl = document.createElement("img");
      jugadaPlayerImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/piedra.svg";
      jugadaPlayerImgEl.classList.add("jugada-player");

      div.appendChild(jugadaPlayerImgEl);
    }
    if (currentGame.playerDos.choice == "papel") {
      const jugadaPlayerImgEl = document.createElement("img");
      jugadaPlayerImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/papel.svg";
      jugadaPlayerImgEl.classList.add("jugada-player");

      div.appendChild(jugadaPlayerImgEl);
    }
    if (currentGame.playerDos.choice == "tijeras") {
      const jugadaPlayerImgEl = document.createElement("img");
      jugadaPlayerImgEl.src =
        "https://marianoaguilar13.github.io/imagenes-proyecto-final/tijera.svg";
      jugadaPlayerImgEl.classList.add("jugada-player");

      div.appendChild(jugadaPlayerImgEl);
    }
  }
}

class Result extends HTMLElement {
  connectedCallback() {
    this.render();
    resultadosJugadas();
    const botonScoreEl = document.querySelector(".boton") as any;
    if (botonScoreEl != null) {
      botonScoreEl.addEventListener("click", (e) => {
        e.preventDefault();
        Router.go("/result-score");
      });
    }
  }

  render() {
    this.innerHTML = `
              <div class="container-result"></div>
              
          `;

    let style = document.createElement("style");
    style.textContent = `
    .container-result {
      display: flex;
      min-height: 100vh;
      width: 100%;
      justify-content: space-between;
      flex-direction: column;
      align-content: center;
    }
    
    @media (min-width: 600px) {
      .container-result {
        
        height: 650px;
        max-width: 450px;
        margin: 0 auto;
      }
    }
    
    .jugada-playerVs {
      height: 300px;
      align-self: center;
      margin-bottom: 20px;
    }
    
    .jugada-player {
      height: 300px;
      align-self: center;
      margin-top: 20px;
    }

    .room-cod{
      font-family: "Poppins", sans-serif;
      font-weight: 700;
      position: fixed;
      font-size: 24px;
      top: 20px;
      left: 20px;
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

    
    
  `;

    this.appendChild(style);
  }
}
customElements.define("result-page", Result);

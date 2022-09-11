import { state } from "../../state";
import { Router } from "../../../node_modules/@vaadin/router";

type Jugada = "piedra" | "papel" | "tijeras";

class ResultScore extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const newData = state.getState();
    const currentGame = newData.currentGame;

    let jugadaPlayer: Jugada;
    let jugadaPlayerVs: Jugada;

    let nombrePlayer;
    let nombrePlayerVs;

    //aca identifico de quien es cada jugada para calcular el resultado
    //de la partida y los nombres para ubicarlos con la perspectiva de cada usuario
    if (newData.usersData.player == "playerUno") {
      jugadaPlayerVs = currentGame.playerDos.choice;
      jugadaPlayer = currentGame.playerUno.choice;
      nombrePlayer = currentGame.playerUno.name;
      nombrePlayerVs = currentGame.playerDos.name;
    } else {
      jugadaPlayerVs = currentGame.playerUno.choice;
      jugadaPlayer = currentGame.playerDos.choice;
      nombrePlayer = currentGame.playerDos.name;
      nombrePlayerVs = currentGame.playerUno.name;
    }

    //aca matcheo las jugadas de los 2 y verifico quien gano
    const resultMatch = state.whoWins(jugadaPlayer, jugadaPlayerVs);

    //obtengo el historial
    const historyRecorrer = newData.history;

    let winPlayerVs = 0;
    let winPlayer = 0;

    //paso el objeto a un array para aplicarle map o for of y recorrerlo
    const arrayHistory = Object.values(historyRecorrer) as any;

    //por cada game del array, veo si estan los 2 jugadores actuales
    //y calculo quien gano de los 2 para ir sumando puntos cuando gana
    arrayHistory.map((gameActual) => {
      if (
        newData.currentGame.playerUno.userId ==
          gameActual.playerUno.idPlayerUno &&
        newData.currentGame.playerDos.userId == gameActual.playerDos.idPlayerDos
      ) {
        let playPlayerVs;
        let playPlayer;

        if (newData.usersData.player == "playerUno") {
          playPlayerVs = gameActual.playerDos.choicePlayerDos;
          playPlayer = gameActual.playerUno.choicePlayerUno;
        } else {
          playPlayerVs = gameActual.playerUno.choicePlayerUno;
          playPlayer = gameActual.playerDos.choicePlayerDos;
        }

        const result = state.whoWins(playPlayer, playPlayerVs);

        if (result == "Victoria") {
          winPlayer++;
        }

        if (result == "Derrota") {
          winPlayerVs++;
        }
      }
    });

    const dataCs = state.getState();
    const roomCod = dataCs.usersData.roomIdCorto;

    this.innerHTML = `
    
    <div class="container">
        <p class="room-cod"> codigo-room: ${roomCod}</p>
        <div class="container-page">
                <h3 class="resultado-titulo"></h3>
                <div class="container-score">
                    <h3 class="score-titulo">Score</h3>
                    <ul class="lista-score">
                    <li class="li-score-vos">${nombrePlayer}:</li>
                    <li class="li-score-maquina">${nombrePlayerVs}:</li>
                    </ul>
                </div>
        </div>
        <button class="boton-volver boton">Volver a Jugar</button>
    </div>
        `;

    let style = document.createElement("style");
    style.textContent = `
    .container {
        height: 100vh;
        width: 100%;
        
    }
    
    @media (min-width: 600px) {
        .container {
        min-height: 80vh;
        width: 450px;
        margin: 0 auto;
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
   
  .container-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 40px auto;
  }
  
  @media (min-width: 600px) {
    .container-page {
      display: flex;
      flex-direction: column;
      width: 450px;
      margin: 20px auto;
    }
  }
  
  .resultado-titulo {
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    font-size: 72px;
    text-align: center;
    color: black;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .container-score {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 0 20px;
    margin: 40px auto;
    border: solid 10px black;
    border-radius: 10px;
    justify-content: space-evenly;
  }
  
  .score-titulo {
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    font-size: 48px;
    text-align: center;
    color: var(--titulos);
    margin-top: 0;
    margin-bottom: 0;
  }
  
  .lista-score {
    list-style-type: none;
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    font-size: 32px;
    text-align: center;
    color: var(--titulos);
  }
  
  .li-score-vos {
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    font-size: 32px;
    text-align: end;
    color: var(--titulos);
  }

  .li-score-maquina {
    font-family: "Poppins", sans-serif;
    font-weight: bold;
    font-size: 32px;
    text-align: end;
    color: var(--titulos);
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

  `;
    this.appendChild(style);

    const tituloEl = this.querySelector(".resultado-titulo") as any;
    tituloEl.textContent = resultMatch.toString();

    const scoreVosEl = this.querySelector(".li-score-vos") as any;
    scoreVosEl.textContent = scoreVosEl.textContent + winPlayer.toString();

    const scoreMaquinaEl = this.querySelector(".li-score-maquina") as any;
    scoreMaquinaEl.textContent =
      scoreMaquinaEl.textContent + winPlayerVs.toString();

    const botonVolverEl = document.querySelector(".boton-volver") as any;

    botonVolverEl.addEventListener("click", (e) => {
      e.preventDefault();
      state.pushEnd();
      Router.go("./instructions");
    });
  }
}
customElements.define("result-score-page", ResultScore);

export function computerJuego() {
  /*Esta funcion genera "aleatoriamente" una jugada de la compu
  para que despues matchee con la del player */

  type Jugada = "piedra" | "papel" | "tijeras";

  let min = 0;
  let max = 3;
  let computerJugada: Jugada;

  function getRandomArbitrary(min, max) {
    let random = Math.random() * (max - min) + min;
    return Math.trunc(random);
  }

  let numAleatorio = getRandomArbitrary(min, max);

  if (numAleatorio == 0) {
    computerJugada = "piedra";
  } else {
    if (numAleatorio == 1) {
      computerJugada = "papel";
    } else {
      computerJugada = "tijeras";
    }
  }

  return computerJugada;
}

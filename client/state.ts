import { rtdb } from "../client/rtdb";
import {
  getDatabase,
  ref,
  set,
  onValue,
  DataSnapshot,
} from "../node_modules/firebase/database";

//const API_BASE_URL = "http://localhost:3000";

const API_BASE_URL = "https://piedra-papel-tijera-online-h78d.onrender.com";

type Jugada = "piedra" | "papel" | "tijeras";
type Game = {
  vsPlay: Jugada;
  myPlay: Jugada;
};

const state = {
  data: {
    currentGame: {},

    usersData: {
      myName: "",
      vsName: "",
      myPlay: "",
      player: "",
      email: "",
      idUser: "",
      roomIdCorto: "",
      roomIdLargo: "",
    },

    history: [],
  },

  listeners: [],

  init() {},

  setMove() {
    const currentState = this.getState();
    currentState.currentGame.myPlay;
  },

  //metodo para ver quien gano el game
  whoWins(myPlay: Jugada, vsPlay: Jugada) {
    //cada constante evalua si el && devuelve true, dependiendo
    //de myPlay y vsPlay enviada por parametro
    const ganeConTijeras = myPlay == "tijeras" && vsPlay == "papel";
    const ganeConPiedra = myPlay == "piedra" && vsPlay == "tijeras";
    const ganeConPapel = myPlay == "papel" && vsPlay == "piedra";

    const gane = [ganeConTijeras, ganeConPiedra, ganeConPapel].includes(true);

    const perdiConTijeras = myPlay == "tijeras" && vsPlay == "piedra";
    const perdiConPiedra = myPlay == "piedra" && vsPlay == "papel";
    const perdiConPapel = myPlay == "papel" && vsPlay == "tijeras";

    const perdi = [perdiConPapel, perdiConPiedra, perdiConTijeras].includes(
      true
    );

    //depende lo que retorna el resultado
    if (perdi == true) {
      return "Derrota";
    } else {
      if (gane == true) {
        return "Victoria";
      } else {
        return "Empate";
      }
    }
  },

  /*
  pushToHistory(play: Game) {
    const currentState = this.getState();
    currentState.history.push(play);
    const historyStingifeado = JSON.stringify(currentState.history);
    localStorage.setItem("history", historyStingifeado);
    this.setState(currentState);
  },*/

  //devuelve la data del ultimo state
  getState() {
    return this.data;
  },

  subscribe(callback: (any) => any) {
    // recibe callbacks para ser avisados posteriormente
    this.listeners.push(callback);
  },

  setState(newState) {
    // modifica this.data (el state) e invoca los callbacks
    this.data = newState;
    //cb de callback
    //cada vez que se modifica el state se ejecutan los cb suscriptos
    for (const cb of this.listeners) {
      cb();
    }
  },

  crearCuenta(callback) {
    const currentState = this.getState();
    //si existe un email en el state va a hacer el fetch-post
    if (currentState.usersData.email) {
      fetch(API_BASE_URL + "/signup", {
        method: "post",
        //necesita este header para que funcione
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          nombre: currentState.usersData.myName,
          email: currentState.usersData.email,
        }),
      }).then((res) => {
        res.json().then((resultado) => {
          //si el resultado.id existe es que se acaba de crear
          //sino va a salir un msj en la consola que no se encuentra
          //si existe el id entonces lo guardo en el state para
          //utilizarlo en las siguientes operaciones
          if (resultado.id) {
            state.setIdUser(resultado.id);
            callback();
          } else {
            console.error(resultado.message);
            callback();
          }
        });
      });
    } else {
      console.error("No hay un email en el State");
      callback();
    }
  },

  //el auth del state sirve para autorizar un email y saber si
  //esta guardado en la db, si es un usuario registrado
  //se utiliza cuando el usuario se loggea con su cuenta
  auth(callback) {
    const currentState = this.getState();
    //si el state tiene un mail guardado hace un post a la api
    if (currentState.usersData.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        //necesita este header para que funcione
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          email: currentState.usersData.email,
        }),
      }).then((res) => {
        res.json().then((resultado) => {
          //si el resultado.id existe etonces es un usuario existente
          //voy a guardarme el id en el state
          //sino va a salir una alerta de que no se encuentra en la db
          if (resultado.id) {
            state.setIdUser(resultado.id);
            callback();
          } else {
            console.error(resultado.message);
            callback();
          }
        });
      });
    } else {
      console.error("El state no contiene ningun email");
    }
  },

  //seteo el nombre y email en el state
  setNombreEmail(nombre: String, email: String) {
    const currentState = this.getState();
    currentState.usersData.myName = nombre;
    currentState.usersData.email = email;

    this.setState(currentState);
  },

  //seteo el mail en el state
  setEmail(email: String) {
    const currentState = this.getState();
    currentState.usersData.email = email;

    this.setState(currentState);
  },

  //seteo el IdUser en el state
  setIdUser(idUser: String) {
    const currentState = this.getState();
    currentState.usersData.idUser = idUser;

    this.setState(currentState);
  },

  //seteo si es playerUno o playerDos en el state
  setPlayer(player: String) {
    const currentState = this.getState();
    currentState.usersData.player = player;

    this.setState(currentState);
  },

  //seteo el id del la room en la db, es el num para ingresar a la room
  setRoomIdCorto(roomIdCorto: String) {
    const currentState = this.getState();
    currentState.usersData.roomIdCorto = roomIdCorto;

    this.setState(currentState);
  },

  //seteo el id de la room de la rtdb
  setRoomIdLargo(roomIdLargo: String) {
    const currentState = this.getState();
    currentState.usersData.roomIdLargo = roomIdLargo;
    this.setState(currentState);
  },

  //crea una room
  crearRoom(callback) {
    const currentState = this.getState();
    //si el estate tiene guardado un idUser entonces hace un post
    // a la api "/rooms" el cual creara la room en la bd y en la
    //rtdb
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        //necesita este header para que funcione
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          userId: currentState.usersData.idUser,
          name: currentState.usersData.myName,
        }),
      }).then((res) => {
        res.json().then((resultado) => {
          //una vez que el backen creó la sala guardo el roomIdCorto
          const roomIdCorto = resultado.id;
          state.setRoomIdCorto(roomIdCorto);
          //con el callback puedo invocar la funcion que envio por parametro
          //cuando termine de resonder la api

          callback();
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  //con esta funcion lo que hace el state es mandar el userId y el
  //roomIdCorto a la api para que esta le devuelva el roomIdLargo
  roomIdLargo(callback) {
    const currentState = state.getState();
    fetch(
      API_BASE_URL +
        "/rooms/" +
        currentState.usersData.roomIdCorto +
        "?userId=" +
        currentState.usersData.idUser,
      {
        method: "GET",

        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => {
      res.json().then((resultado) => {
        //una vez que el backen creó la sala guardo el roomIdLargo
        //en el state
        if (resultado.message) {
          //si existe el message es que hubo un error asi que imprimo ese error
          console.error(resultado.message);
          callback();
        } else {
          //una vez que el backen creó la sala guardo el roomIdLargo
          //en el state
          const roomIdLargo = resultado;
          state.setRoomIdLargo(roomIdLargo);
          callback();
        }
      });
    });
  },

  //con esta funcion el state se conecta al rtdb para escuchar cambio
  //en el room que le paso, este id sera el Largo que es el que crea
  //automaticamente la libreria UUID
  conectRoomRt() {
    const currentState = this.getState();

    const chatRoomRef = ref(
      rtdb,
      "rooms/" + currentState.usersData.roomIdLargo
    );

    onValue(chatRoomRef, (snapshot) => {
      //la constante valor es un objeto
      const dbRealTime = snapshot.val();

      currentState.history = dbRealTime.history;

      currentState.currentGame = {
        playerUno: dbRealTime.playerUno,
        playerDos: dbRealTime.playerDos,
      };

      this.setState(currentState);
    });
  },

  //me traigo el nombre del player guardado en la db
  getSetName(callback) {
    const currentState = state.getState();
    fetch(API_BASE_URL + "/nombre/" + currentState.usersData.idUser, {
      method: "GET",
      //necesita este header para que funcione
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((resultado) => {
        //me guardo el nombre obtenido en el state
        const name = resultado.nombre;
        currentState.usersData.myName = name;
        state.setState(currentState);

        callback();
      });
    });
  },

  //indica si es el player 1 o el 2
  whoIsPlayer(callback) {
    const currentState = state.getState();
    fetch(API_BASE_URL + "/rooms/owner/" + currentState.usersData.roomIdCorto, {
      method: "GET",

      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((resultado) => {
        const owner = resultado;
        if (currentState.usersData.idUser != owner) {
          state.setPlayer("playerDos");
        } else {
          state.setPlayer("playerUno");
        }

        callback();
      });
    });
  },

  //pongo los datos iniciales para poner todas las caracteristicas
  //del objeto en la rtdb
  pushDatosInicialesRtdb(callback) {
    const currentState = this.getState();

    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/rooms/conect", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          userId: currentState.usersData.idUser,
          roomLongId: currentState.usersData.roomIdLargo,
          roomId: currentState.usersData.roomIdCorto,
          name: currentState.usersData.myName,
        }),
      }).then((res) => {
        res.json().then((resultado) => {
          callback();
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  //pusheo si el jugador apreto en jugar y cambo a start = "start"
  pushStart(callback) {
    const currentState = this.getState();

    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/player/start", {
        method: "post",

        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          player: currentState.usersData.player,
          userId: currentState.usersData.idUser,
          roomLongId: currentState.usersData.roomIdLargo,
          start: "start",
          name: currentState.usersData.myName,
        }),
      }).then((res) => {
        res.json().then((resultado) => {
          callback();
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  //pusheEnd marca al start = "falso", lo que indica que no esta listo para jugar
  pushEnd() {
    const currentState = this.getState();
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/player/start", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          player: currentState.usersData.player,
          userId: currentState.usersData.idUser,
          roomLongId: currentState.usersData.roomIdLargo,
          start: "false",
          name: currentState.usersData.myName,
        }),
      }).then((res) => {
        res.json().then(() => {});
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  //pusheo la jugada a la rtdb
  pushPlay() {
    const currentState = this.getState();
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/player/play", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          player: currentState.usersData.player,
          userId: currentState.usersData.idUser,
          roomLongId: currentState.usersData.roomIdLargo,
          name: currentState.usersData.myName,
          choice: currentState.usersData.myPlay,
          start: "start",
        }),
      }).then((res) => {
        res.json().then((resultado) => {
          console.log("Todo ok");
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  //verifica si los 2 jugadores estan en start
  playersStart() {
    const cs = this.getState();
    if (
      cs.currentGame.playerUno.start == "start" &&
      cs.currentGame.playerDos.start == "start"
    ) {
      return true;
    } else {
      return false;
    }
  },

  //pushea la ultima jugada al historial que es un array en la rtdb
  pushHistoryDB(callback) {
    const currentState = this.getState();
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/rooms/history", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },

        body: JSON.stringify({
          idPlayerUno: currentState.currentGame.playerUno.userId,
          namePlayerUno: currentState.currentGame.playerUno.name,
          choicePlayerUno: currentState.currentGame.playerUno.choice,
          idPlayerDos: currentState.currentGame.playerDos.userId,
          namePlayerDos: currentState.currentGame.playerDos.name,
          choicePlayerDos: currentState.currentGame.playerDos.choice,
          roomIdLargo: currentState.usersData.roomIdLargo,
        }),
      }).then((res) => {
        res.json().then(() => {
          callback();
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  jugadaRandom() {
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
  },
};

export { state };

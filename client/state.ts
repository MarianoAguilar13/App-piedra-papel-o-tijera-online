import { rtdb } from "../client/rtdb";
import {
  getDatabase,
  ref,
  set,
  onValue,
  DataSnapshot,
} from "../node_modules/firebase/database";
import map from "../node_modules/lodash";

//const API_BASE_URL = "http://localhost:3000";

const API_BASE_URL = "http://app-piedra-papel-o-tijeras.herokuapp.com";

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

  /*Aca pushea la nueva jugada acumulandola en el historial de jugada
  ya que este historial es que se va a recorrer para calcular el score */

  pushToHistory(play: Game) {
    const currentState = this.getState();
    currentState.history.push(play);
    const historyStingifeado = JSON.stringify(currentState.history);
    localStorage.setItem("history", historyStingifeado);
    this.setState(currentState);
  },

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
    //a la direc /auth , que este matchea en la db a ver si existe
    //el usuario, en el caso de poner una contraseña, tambien esta
    //deberia controlarse en este paso
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
          //voy a guardarme el id en el state para luego usarlo para
          //poder crear las rooms
          //sino va a salir una alerta de que no se encuentra en la db
          //por lo tanto no estara a autorizado para utilizar el chat
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

  setNombreEmail(nombre: String, email: String) {
    const currentState = this.getState();
    currentState.usersData.myName = nombre;
    currentState.usersData.email = email;
    console.log("el nuevo state tiene data.usersData.nombre: " + nombre);
    console.log("el nuevo state tiene data.usersData.email: " + email);
    this.setState(currentState);
  },

  setEmail(email: String) {
    const currentState = this.getState();
    currentState.usersData.email = email;
    console.log("el nuevo state tiene data.usersData.email: " + email);
    this.setState(currentState);
  },

  setIdUser(idUser: String) {
    const currentState = this.getState();
    currentState.usersData.idUser = idUser;
    console.log("el nuevo state tiene data.usersData.idUser: " + idUser);
    this.setState(currentState);
  },

  setPlayer(player: String) {
    const currentState = this.getState();
    currentState.usersData.player = player;
    console.log("el nuevo state tiene data.usersData.player: " + player);
    this.setState(currentState);
  },

  setRoomIdCorto(roomIdCorto: String) {
    const currentState = this.getState();
    currentState.usersData.roomIdCorto = roomIdCorto;
    console.log(
      "el nuevo state tiene data.usersData.roomIdCorto: " + roomIdCorto
    );
    this.setState(currentState);
  },

  setRoomIdLargo(roomIdLargo: String) {
    const currentState = this.getState();
    currentState.usersData.roomIdLargo = roomIdLargo;
    console.log(
      "el nuevo state tiene data.usersData.roomIdLargo: " + roomIdLargo
    );
    this.setState(currentState);
  },

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
          //en el state para despues conectarme a este cuando entre
          //al chat y me conecte a la room con el onValue
          const roomIdCorto = resultado.id;
          state.setRoomIdCorto(roomIdCorto);
          //con el callback voy a llamar a la route para que cuando termine
          //de ejecutarse todo lo de esta funcion me envie hacia la siguiente pag
          //la pag del chat y ahi es donde voy a conectarme con
          //el state.conectRoomRt que utiliza el onValue de la rtdb
          callback();
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },

  //con esta funcion lo que hace el state es mandar el userId y el
  //roomIdCorto a la api para que esta le devuelva el roomIdLargo
  //como este es el metodo get paso todo por url
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
        //necesita este header para que funcione
        headers: {
          "content-type": "application/json",
        },
      }
    ).then((res) => {
      console.log("esto tiene res" + res);

      res.json().then((resultado) => {
        //una vez que el backen creo la sala guardo el roomIdLargo
        //en el state para despues conectarme a este cuando entre
        //al chat y me conecte a la room con el onValue
        console.log("este es la data de la api roomidlargo" + resultado);

        const roomIdLargo = resultado;
        state.setRoomIdLargo(roomIdLargo);
        callback();
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
      console.log(
        "este es el currentGame.playerUno.name del OnValue: " +
          currentState.currentGame.playerUno.name
      );

      this.setState(currentState);
    });
  },

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
        //una vez que el backen creo la sala guardo el roomIdLargo
        //en el state para despues conectarme a este cuando entre
        //al chat y me conecte a la room con el onValue
        console.log("este es la data de la api roomidlargo" + resultado.mombre);

        const name = resultado.nombre;
        currentState.usersData.myName = name;
        state.setState(currentState);
        console.log("el name es: " + state.getState().usersData.myName);

        callback();
      });
    });
  },

  whoIsPlayer(callback) {
    const currentState = state.getState();
    fetch(API_BASE_URL + "/rooms/owner/" + currentState.usersData.roomIdCorto, {
      method: "GET",
      //necesita este header para que funcione
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      res.json().then((resultado) => {
        //una vez que el backen creo la sala guardo el roomIdLargo
        //en el state para despues conectarme a este cuando entre
        //al chat y me conecte a la room con el onValue
        console.log("este es el owner de la room" + resultado);

        const owner = resultado;
        if (currentState.usersData.idUser != owner) {
          state.setPlayer("playerDos");
          console.log("Ahora soy el playerDos");
        } else {
          state.setPlayer("playerUno");
          console.log("Ahora soy el playerUno");
        }

        callback();
      });
    });
  },

  pushDatosInicialesRtdb(callback) {
    const currentState = this.getState();
    //si el estate tiene guardado un idUser entonces hace un post
    // a la api "/rooms" el cual creara la room en la bd y en la
    //rtdb
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/rooms/conect", {
        method: "post",
        //necesita este header para que funcione
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

  pushStart(callback) {
    const currentState = this.getState();
    //si el estate tiene guardado un idUser entonces hace un post
    // a la api "/rooms" el cual creara la room en la bd y en la
    //rtdb
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/player/start", {
        method: "post",
        //necesita este header para que funcione
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

  pushPlay() {
    const currentState = this.getState();
    //si el estate tiene guardado un idUser entonces hace un post
    // a la api "/rooms" el cual creara la room en la bd y en la
    //rtdb
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/player/play", {
        method: "post",
        //necesita este header para que funcione
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

  pushHistoryDB(callback) {
    const currentState = this.getState();
    //si el estate tiene guardado un idUser entonces hace un post
    // a la api "/rooms" el cual creara la room en la bd y en la
    //rtdb
    if (currentState.usersData.idUser) {
      fetch(API_BASE_URL + "/rooms/history", {
        method: "post",
        //necesita este header para que funcione
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
          console.log("Todo ok");
          callback();
        });
      });
    } else {
      console.error("El state no tiene ningun idUser");
    }
  },
};

export { state };

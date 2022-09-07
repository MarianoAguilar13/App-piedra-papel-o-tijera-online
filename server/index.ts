import * as express from "../node_modules/express";
import { firestore, rtdb } from "./db";
import * as cors from "../node_modules/cors";
import { v4 as uuidv4 } from "../node_modules/uuid";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//si el email no esta guardado, entonces creo un user con ese nombre
//y con el email, tambien envio el id con el que se creo
app.post("/signup", function (req, res) {
  const email = req.body.email;
  const nombre = req.body.nombre;

  usersCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      //el searchResponse que es la respuesta del get, siempre me trae
      //una lista por mas que solo un usuario tiene ese email
      if (searchResponse.empty) {
        //con el add agrego el usuario con el email y nombre
        //generando el id y lo envio al state/front
        usersCollection
          .add({
            email,
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
            });
          });
      } else {
        res.status(400).json({
          message: "user already exists",
        });
      }
    });
});

//con el auth verifico si existe un users con el mail y si existe envio el id
app.post("/auth", (req, res) => {
  const { email } = req.body;

  usersCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      //si el email no lo encuentra envia un error

      if (searchResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          //el searchResponse que es la respuesta del get, siempre me trae
          //una lista por mas que solo un usuario tiene ese email
          id: searchResponse.docs[0].id,
        });
      }
    });
});

//devuelve el nombre del usuario cuyo id pasamos por parametro
app.get("/nombre/:userId", (req, res) => {
  const { userId } = req.params;

  usersCollection
    .doc(userId.toString())
    .get()
    .then((snap) => {
      //si el id del user no lo encuentra envia un error
      if (snap.exists) {
        const data = snap.data();

        //respondo el nombre del usuario del id buscado
        res.json({ nombre: data.nombre });
      } else {
        res.status(401).json({
          message: "no existe el usuario",
        });
      }
    });
});

//creo la room en la db y tambien en la rtdb, devuelvo el id de
//la room db que es el "roomIdCorto", que sirve para conectarse a la room
app.post("/rooms", (req, res) => {
  const userId = req.body.userId;
  const { name } = req.body;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        //si existe el usario, entonces vamos a crear una room
        //con un id
        const idRandom = uuidv4();
        const roomRef = rtdb.ref("rooms/" + idRandom);

        //en la room rtdb seteo el playerUno que es el owner
        //e inicio el array de jugadas

        roomRef
          .set({
            playerUno: {
              name: name.toString(),
              userId: userId.toString(),
              choice: "ninguno",
              online: "true",
              start: "false",
            },
            playerDos: {
              name: "",
              userId: "",
              choice: "ninguno",
              online: "true",
              start: "false",
            },
            history: [
              {
                playerUno: {
                  idPlayerUno: "1",
                },
                playerDos: {
                  idPlayerDos: "2",
                },
              },
            ],
          })
          .then(() => {
            //aca voy a crear un id mas corto para que se puedan conectar con este
            //y asi mantener oculto el id de los rooms dentro de la DB
            const roomLongId = roomRef.key;
            const roomId = 100000 + Math.floor(Math.random() * 99999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
                owner: userId,
                history: [],
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                  //respondo el id corto al state/front para que ultilicen este
                  //para conectarse
                });
              });
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

//sirve para pedir el roomIdLargo que es el id de la room rtdb
//para despues poder conectarnos a esta y escuchar los cambio
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;

  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      //si el id del user no lo encuentra envia un error
      if (doc.exists) {
        //despues buesca entre los room el que tenga el id"corto"
        //pasado por parametro para obtener el id largo
        roomsCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            if (snap.exists) {
              const data = snap.data();
              //en data solo existe el id"dificil" que esta dentro
              //de la room de la fs, pero para devolver directamente
              //el id"dificil" vamos a enviar data.rtdbRoomId
              res.json(data.rtdbRoomId);
            } else {
              res.status(401).json({
                message: "La room no existe, codigo-room incorrecto",
              });
            }
          });
      } else {
        res.status(401).json({
          message: "no existís",
        });
      }
    });
});

//conecta al jugador con sus datos, a la room de la rtdb
app.post("/rooms/conect", (req, res) => {
  const { userId } = req.body;
  const { roomLongId } = req.body;
  const { roomId } = req.body;
  const { name } = req.body;

  //primero me fijo que existe el id
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("rooms/" + roomLongId);

        //despues de chequear el userId voy a la rooms para ver
        //si el ingresado es el owner (playerUno) o no, esa data de owner
        //esta dentro de la rooms de la db
        roomsCollection
          .doc(roomId.toString())
          .get()
          .then((snap) => {
            const data = snap.data();

            //si el usuario no es el owner va a ser le playerDos
            //el cual se actualizaran los datos
            if (data.owner != userId) {
              roomRef
                .update({
                  playerDos: {
                    name: name.toString(),
                    userId: userId.toString(),
                    choice: "ninguno",
                    online: "true",
                    start: "false",
                  },
                })
                .then(() => {
                  res.json({
                    playerDos: userId,
                  });
                });
            } else {
              res.json({
                message:
                  "El userId es el owner ingrese otro participante con otro id",
              });
            }
          });
      } else {
        res.status(401).json({
          message: "no existis",
        });
      }
    });
});

//me devuelve el dueño de la room
app.get("/rooms/owner/:roomId", (req, res) => {
  const { roomId } = req.params;

  roomsCollection
    .doc(roomId)
    .get()
    .then((snap) => {
      const data = snap.data();
      res.json(data.owner);
    });
});

//pusheo una play de un jugardor a la room de la rtdb
app.post("/player/play", (req, res) => {
  const { userId } = req.body;
  const { name } = req.body;
  const { roomLongId } = req.body;
  const { choice } = req.body;
  const { start } = req.body;
  const { player } = req.body;

  const roomRef = rtdb.ref("rooms/" + roomLongId);

  roomRef
    .update({
      [player]: {
        name: name,
        userId: userId,
        choice: choice,
        online: "true",
        start: start,
      },
    })
    .then(() => {
      res.json({
        message: "Todo ok",
      });
    });
});

//pusheo el estado de start="start" de un jugardor a la room de la rtdb
app.post("/player/start", (req, res) => {
  const { userId } = req.body;
  const { name } = req.body;
  const { roomLongId } = req.body;
  const { start } = req.body;
  const { player } = req.body;

  const roomRef = rtdb.ref("rooms/" + roomLongId);

  roomRef
    .update({
      [player]: {
        name: name,
        userId: userId,
        choice: "ninguno",
        online: "true",
        start: start,
      },
    })
    .then(() => {
      res.json({
        message: "Todo ok",
      });
    });
});

//pusheo la ultima jugada al historial que se encuentra en la room de la rtdb
app.post("/rooms/history", (req, res) => {
  const { idPlayerUno } = req.body;
  const { namePlayerUno } = req.body;
  const { choicePlayerUno } = req.body;
  const { idPlayerDos } = req.body;
  const { namePlayerDos } = req.body;
  const { choicePlayerDos } = req.body;
  const { roomIdLargo } = req.body;

  const chatRoomRef = rtdb.ref("rooms/" + roomIdLargo + "/history");

  const jugada = {
    playerUno: {
      idPlayerUno: idPlayerUno,
      namePlayerUno: namePlayerUno,
      choicePlayerUno: choicePlayerUno,
    },
    playerDos: {
      idPlayerDos: idPlayerDos,
      namePlayerDos: namePlayerDos,
      choicePlayerDos: choicePlayerDos,
    },
  };

  chatRoomRef.push(jugada, function () {
    res.json("todo ok");
  });
});

app.listen(port, () => {});

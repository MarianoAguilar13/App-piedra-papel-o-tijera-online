import * as express from "../node_modules/express";
import { firestore, rtdb } from "./db";
import * as cors from "../node_modules/cors";
import { v4 as uuidv4 } from "../node_modules/uuid";

const port = process.env.PORT || 3000;
const app = express();

//la app(api) tiene incluido la funcion json de express, por
//lo tanto se podra usar en toda la api y enviar objetos del body
//mediante postman, el cors y este .json() se llaman midleware
app.use(express.json());
app.use(cors());

app.use(express.static("dist"));

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

app.post("/signup", function (req, res) {
  const email = req.body.email;
  const nombre = req.body.nombre;
  //aca vamos a buscar en la DB con el where si, hay algun usuario
  //con email igual al email pasado por el body
  usersCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      //si el email no existe entonces lo voy a agregar para crear
      //el id y si ya existe envio devuelvo el id al state
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
        //el searchResponse que es la respuesta del get, siempre me trae
        //una lista por mas que solo un usuario tiene ese email
        res.status(400).json({
          message: "user already exists",
        });
      }
    });
});

app.post("/auth", (req, res) => {
  //las llaves me indica que va a pedirle al body la propiedad email
  //y va a crear una constante con el mismo nombre
  const { email } = req.body;

  usersCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      //si el email no lo encuentra envia un error
      console.log(searchResponse);

      if (searchResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        //si el email se encontro significa que el usuario esta creado
        //y le enviamos su id para que el state tenga ese dato y el
        //fornt pueda realizar sus operaciones con el mismo

        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

app.get("/nombre/:userId", (req, res) => {
  const { userId } = req.params;

  usersCollection
    .doc(userId.toString())
    .get()
    .then((snap) => {
      //si el id del user no lo encuentra envia un error
      if (snap.exists) {
        const data = snap.data();

        res.json({ nombre: data.nombre });
      }
      //despues buesca entre los room el que tenga el id"corto"
      //pasado por parametro para obtener el id largo
      else {
        res.status(401).json({
          message: "no existe el usuario",
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const userId = req.body.userId;
  const { name } = req.body;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        //si existe el usario, entonces vamos a crear una room
        //con un id creado con la libreria nanoid
        const idRandom = uuidv4();
        const roomRef = rtdb.ref("rooms/" + idRandom);

        //en la rooms/id va a crear messa y el owner que es quien
        //creo la sala

        roomRef
          .set({
            playerUno: {
              name: name.toString(),
              userId: userId.toString(),
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
            const data = snap.data();
            //en data solo existe el id"dificil" que esta dentro
            //de la room de la fs, pero para devolver directamente
            //el id"dificil" vamos a enviar data.rtdbRoomId
            res.json(data.rtdbRoomId);
          });
      } else {
        res.status(401).json({
          message: "no existís",
        });
      }
    });
});

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
        //si el ingresado es el owner (player1) o no, esa data de owner
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

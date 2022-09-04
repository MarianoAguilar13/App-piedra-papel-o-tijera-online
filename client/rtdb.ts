import { initializeApp } from "../node_modules/firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  DataSnapshot,
} from "../node_modules/firebase/database";

const firebaseConfig = {
  //usuarios y servicios => cuentas de servicios => secretos de la base de datos
  //ahi encuentro la key
  apiKey: "WoCyzTj99w0uggZ3GKqfHNm3RittuB1ATncuWbCi",
  databaseURL:
    "https://juego-piedra-papel-o-tijera-default-rtdb.firebaseio.com/",
  authDomain: "juego-piedra-papel-o-tijera.firebaseapp.com",
  projectId: "juego-piedra-papel-o-tijera",
};

const firebaseApp = initializeApp(firebaseConfig);
const rtdb = getDatabase(firebaseApp); //RTDB//

export { rtdb };

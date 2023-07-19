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
  apiKey: process.env.APIKEY,
  databaseURL: process.env.DATABASEURL,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
};

const firebaseApp = initializeApp(firebaseConfig);
const rtdb = getDatabase(firebaseApp); //RTDB//

export { rtdb };

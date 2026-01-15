import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "mysql",
  user: "lovesync",
  password: "Asd123??",
  database: "lovesync"
});



import * as express from "express";
import * as Database from "better-sqlite3";
const db = new Database("foobar.db", { verbose: console.log });
const app = express();

app.get("/hello", (req, res) => {
   console.log("HELLO!");
   res.send("Hello!");
});

app.get("/json", (req, res) => {
   res.json({ msg: "HELLO!" });
});

app.get("/create/:id", (req, res) => {
   const id = req.params.id;
   console.log("CREATE>>> ", id);
   res.send(`Sent ID: ${id}`);
});

const server = app.listen(3000, () => {
   const port = (server.address() as any).port;
   console.log(`server listening at http://localhost:${port}`);
});

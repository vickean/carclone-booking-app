import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";

const main = async () => {
   await createConnection();

   const app = express();

   app.get("/hello", (req, res) => {
      console.log("HELLO!");
      res.send("Hello!");
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
};

main().catch((err) => console.log(err));

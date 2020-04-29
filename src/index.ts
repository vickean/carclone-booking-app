import express from "express";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import cars from "../assets/cars.json";
import { User } from "entity/User";

const main = async () => {
   await createConnection();

   const app = express();

   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use("/static", express.static("public"));

   app.get("/create/:id", (req, res) => {
      const id = req.params.id;
      console.log("CREATE>>> ", id);
      res.send(`Sent ID: ${id}`);
   });

   app.get("/cars", (req, res) => {
      res.json(cars);
   });

   app.post("/user", async (req, res) => {
      console.log(req.body);

      const insert = await getRepository(User).save({
         name: req.body.name,
         email: req.body.email,
         phoneNum: req.body.phoneNum,
         carBrand: req.body.brand,
         carModel: req.body.model,
      });

      console.log(insert);

      res.send("<a href='http://localhost:3000/static/index.html'>Received</a>");
   });

   const server = app.listen(3000, () => {
      const port = (server.address() as any).port;
      console.log(`server listening at http://localhost:${port}`);
   });
};

main().catch((err) => console.log(err));

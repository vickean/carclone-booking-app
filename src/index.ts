import express from "express";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import cars from "../assets/cars.json";
import locations from "../assets/locations.json";
import { User } from "entity/User";
import { Booking } from "entity/Booking";
import { addDays } from "date-fns";

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

   app.get("/locations", (req, res) => {
      res.json(locations);
   });

   app.get("/cars", (req, res) => {
      res.json(cars);
   });

   app.post("/available-slots", (req, res) => {
      const startTime = new Date("1982-01-01T01:00:00.00Z");
      const endTime = new Date("1982-01-01T10:00:00.00Z");
      const startDate = new Date();
      const endDate = addDays(new Date(), 14);

      // WORK IN PROGRESS
      // implement generator function

      res.json({ test: "hello" });
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

      res.redirect(`/static/booking.html?id=${insert.id}`);
   });

   app.post("/timeslot", async (req, res) => {
      console.log(req.body);

      const insert = await getRepository(Booking).save({
         userId: req.body.userId,
         dateTime: req.body.dateTime,
         location: req.body.location,
         slotNum: req.body.slotNum,
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

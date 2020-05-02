import express from "express";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import cars from "../assets/cars.json";
import locations from "../assets/locations.json";
import { User } from "entity/User";
import { Booking } from "entity/Booking";
import {
   addDays,
   differenceInHours,
   format,
   formatISO,
   addHours,
   addMinutes,
} from "date-fns";

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

   app.get("/available-slots", (req, res) => {
      const startTime = new Date("1982-01-01T01:00:00.00Z"); // 9AM +8GMT
      const endTime = new Date("1982-01-01T10:00:00.00Z"); // 6PM +8GMT

      const dayHours = differenceInHours(endTime, startTime); // 9 hours
      const noOfSlotGroups = dayHours * 2; // 18 slot groups

      const daysArr = [...Array(14).keys()];
      const slotGroups = [...Array(noOfSlotGroups).keys()];

      // creates array of days with slotGroups
      const dateArr = daysArr.map((el) => {
         const date = addDays(new Date(), el);
         const day = date.getDay();
         const slotsPerGroup = day < 6 && day > 0 ? 2 : 4;

         // creates array of slotGroups with slots
         const slotGrpArr = slotGroups.map((el2) => {
            const sltDate = formatISO(date, { representation: "date" });
            const sltTime = formatISO(addMinutes(startTime, 30 * el2), {
               representation: "time",
            });
            const time = new Date(`${sltDate}T${sltTime}`);

            const sltGroup = [...Array(slotsPerGroup).keys()].map((el3) => {
               return {
                  slotNo: el3 + 1,
                  available: true,
               };
            });

            const slotGrpObj = {
               time,
               slots: sltGroup,
            };

            return slotGrpObj;
         });

         const returnObj = {
            date,
            day,
            slotsPerGroup,
            slotGrpArr,
         };

         return returnObj;
      });

      //Pending check db if slot Taken, if yes, set "available" to false.

      res.json(dateArr);
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

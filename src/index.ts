import cors from "cors";
import { addDays, addMinutes, differenceInHours, formatISO } from "date-fns";
import { Booking } from "entity/Booking";
import { User } from "entity/User";
import express from "express";
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import cars from "../assets/cars.json";
import locations from "../assets/locations.json";

const main = async () => {
   await createConnection();

   const app = express();

   app.use(
      cors({
         origin: ["http://localhost:3000"],
         credentials: true,
      })
   );
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use("/static", express.static("public"));

   app.get("/locations", (req, res) => {
      res.json(locations);
   });

   app.get("/cars", (req, res) => {
      res.json(cars);
   });

   app.get("/available-slots/:location", async (req, res) => {
      const location = req.params.location;
      console.log(location);

      // queries for existing bookings
      const existRec = await getRepository(Booking)
         .createQueryBuilder("booking")
         .where("booking.location = :location", { location })
         .andWhere("booking.dateTime BETWEEN :begin AND :end", {
            begin: addDays(new Date(), 1).toISOString(),
            end: addDays(new Date(), 14).toISOString(),
         })
         .getMany();

      // console.log("existing>>> ", existRec);

      const startTime = new Date("1982-01-01T01:00:00.00Z"); // 9AM +8GMT
      const endTime = new Date("1982-01-01T10:00:00.00Z"); // 6PM +8GMT

      const dayHours = differenceInHours(endTime, startTime); // 9 hours
      const noOfSlotGroups = dayHours * 2; // 18 slot groups

      const daysArr = [...Array(14).keys()];
      const slotGroups = [...Array(noOfSlotGroups).keys()];

      // creates array of days with slotGroups
      const dateArr = daysArr.map((el) => {
         const date = addDays(new Date(), el + 1);
         const day = date.getDay();
         const slotsPerGroup = day < 6 && day > 0 ? 2 : 4;

         // creates array of slotGroups with slots
         const slotGrpArr = slotGroups.map((el2) => {
            const sltDate = formatISO(date, { representation: "date" });
            const sltTime = formatISO(addMinutes(startTime, 30 * el2), {
               representation: "time",
            });
            const time = new Date(`${sltDate}T${sltTime}`);

            // filter bookings that match date
            const bookCheck = existRec.filter((el4: Booking) => {
               return time.toISOString() === el4.dateTime.toISOString();
            });

            // generate array of booked slot numbers
            const bookCheckSlotNums = bookCheck.map((el5: Booking) => el5.slotNum);

            // console.log("CHECK>>> ", time, bookCheck, bookCheckSlotNums);

            const sltGroup = [...Array(slotsPerGroup).keys()].map((el3) => {
               return {
                  slotNo: el3 + 1,
                  available: !bookCheckSlotNums.includes(el3 + 1),
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

      res.json(dateArr);
   });

   app.post("/user", async (req, res) => {
      // console.log(req.body);

      const insert = await getRepository(User).save({
         name: req.body.name,
         email: req.body.email,
         phoneNum: req.body.phoneNum,
         carBrand: req.body.carBrand,
         carModel: req.body.carModel,
      });

      // console.log(insert);

      res.json(insert);
   });

   app.post("/timeslot", async (req, res) => {
      // console.log(req.body);

      const insert = await getRepository(Booking).save({
         userId: req.body.userId,
         dateTime: req.body.dateTime,
         location: req.body.location,
         slotNum: req.body.slotNum,
      });

      // console.log(insert);

      res.json(insert);
   });

   const server = app.listen(4000, () => {
      const port = (server.address() as any).port;
      console.log(`server listening at http://localhost:${port}`);
   });
};

main().catch((err) => console.log(err));

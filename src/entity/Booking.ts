import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "c_bookings" })
export class Booking extends BaseEntity {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   userId: string;

   @Column()
   dateTime: Date;

   @Column()
   location: string;

   @Column()
   slotNum: number;

   @Column({ default: new Date().toISOString() })
   createdTs: Date;
}

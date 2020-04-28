import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "c_users" })
export class Users extends BaseEntity {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   name: string;

   @Column()
   email: string;

   @Column()
   phoneNum: string;

   @Column()
   createdTs: Date;
}

import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "c_users" })
export class User extends BaseEntity {
   @PrimaryGeneratedColumn("uuid")
   id: string;

   @Column()
   name: string;

   @Column()
   email: string;

   @Column()
   phoneNum: string;

   @Column()
   carBrand: string;

   @Column()
   carModel: string;

   @Column({ default: new Date().toISOString() })
   createdTs: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Users } from "./user";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ default: false })
  completed!: boolean;

  @ManyToOne(() => Users, (user) => user.todos, { onDelete: "CASCADE" })
  user!: Users;

  @CreateDateColumn()
  createdAt!: Date;
}

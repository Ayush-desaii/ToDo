import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Todo } from "./todo";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Todo, (todos) => todos.user)
  todos!: Todo[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

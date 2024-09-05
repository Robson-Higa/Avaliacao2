/* eslint-disable import/prefer-default-export */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Area from "./Area";
import { Autor } from "./Autor";

@Entity()
export class Trabalho {
  static create(trabalho: Trabalho) {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  codigo: string;

  @Column()
  area: Area;

  @ManyToMany(() => Autor)
  @JoinTable()
  autores: Autor[];
}

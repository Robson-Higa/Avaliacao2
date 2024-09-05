/* eslint-disable import/prefer-default-export */
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import Genero from "./Genero";

@Entity()
export class Autor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  genero: Genero;

  @Column({ length: 11 })
  cpf: string;
}

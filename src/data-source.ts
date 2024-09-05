/* eslint-disable import/prefer-default-export */
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Autor } from "./entity/Autor";
import { Trabalho } from "./entity/Trabalho";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "feciaqteste.db",
  synchronize: true,
  logging: true,
  entities: [Autor, Trabalho],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => console.log("Data source inicializado"))
  .catch((erro) =>
    console.error("Erro ao tentar inicializar o data source", erro),
  );

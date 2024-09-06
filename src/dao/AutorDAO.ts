/* eslint-disable prettier/prettier */
/* eslint-disable import/named */
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Autor } from "../entity/Autor";

export default class AutorDAO {
  autorRepo: Repository<Autor>;

  constructor() {
    this.autorRepo = AppDataSource.getRepository(Autor);
  }

  async salvar(autor: Partial<Autor> & Autor) {
    const autorSalvo = await this.autorRepo.save(autor);
    return autorSalvo;
  }
}

/* eslint-disable prettier/prettier */
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Trabalho } from "../entity/Trabalho";

export default class TrabalhoDAO {
  trabalhoRepo: Repository<Trabalho>;

  constructor() {
    this.trabalhoRepo = AppDataSource.getRepository(Trabalho);
  }

  async salvar(trabalho: Partial<Trabalho> & Trabalho) {
    const trabalhoSalvo = await this.trabalhoRepo.save(trabalho);
    return trabalhoSalvo;
  }
}

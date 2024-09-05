import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Trabalho } from "../entity/Trabalho";
import { Autor } from "../entity/Autor";

export class TrabalhoDAO {
  trabalhoRepo: Repository<Trabalho>;

  constructor() {
    this.trabalhoRepo = AppDataSource.getRepository(Trabalho);
  }

  async salvar(trabalho: Partial <Trabalho> & Trabalho) {
    const trabalhoSalvo = await this.trabalhoRepo.save(trabalho);
    return trabalhoSalvo;
  }
}

export class AutorDAO {
  autorRepo: Repository<Autor>;

  constructor() {
    this.autorRepo = AppDataSource.getRepository(Autor);
  }

  async salvar(autor: Partial <Autor> & Autor) {
    const autorSalvo = await this.autorRepo.save(autor);
    return autorSalvo;
  }
}

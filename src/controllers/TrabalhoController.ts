/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Autor } from "../entity/Autor";
import { Trabalho } from "../entity/Trabalho";
import  Area  from "../entity/Area";

export default class TrabalhoController {
  async salvar(req: Request, res: Response) {
    const { titulo, area, codigo, autores } = req.body;

    if (!titulo) {
      return res.status(400).json({ message: "O trabalho deve conter um título!" });
    }

    if (!autores.cpf || autores.cpf.length !== 11) {
          return res.status(400).json({ message: "CPF inválido!" });
    }

    if (!autores.genero || autores.genero !== 'M' || autores.genero !== 'F') {
      return res.status(400).json({ message: "Gênero inválido!" });
    }

    const autorNome = autores.nome.trim().split(/\s+/);

    if (autorNome.length === 0 || autorNome.length === 1) {
      return res.status(400).json({ message: "Nome inválido!" })
    }

    if (!Object.values(Area).includes(area)) {
      return res.status(400).json({ message: "Área inválida!" });
    }

    if (!codigo.startsWith(area)) {
      return res.status(400).json({ message: "Código inválido!" })
    }

    if (autores.length > 7) {
      return res.status(400).json({ message: "O trabalho não deve conter mais de 7 autores" });
    }

     if (autores.length === 1) {
      return res.status(400).json({ message: "O trabalho deve conter mais de 1 autor" });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const autoresSalvos: Autor[] = [];

      for (let i = 0; i < autores.length; i++) {
        const autor = new Autor();
        Object.assign(autor, autores[i]);
        const autorSalvo = await transactionalEntityManager.save(autor);
        autoresSalvos.push(autorSalvo);
      }

      const trabalho = new Trabalho();
      trabalho.area = area;
      trabalho.codigo = codigo;
      trabalho.titulo = titulo;
      trabalho.autores = autoresSalvos;

      const trabalhoSalvo = await transactionalEntityManager.save(trabalho);
      return res.status(201).json({ trabalho: trabalhoSalvo });
    });
  }
}

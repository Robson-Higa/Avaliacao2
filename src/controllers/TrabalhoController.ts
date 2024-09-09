/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-arrow-callback */
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Autor } from "../entity/Autor";
import { Trabalho } from "../entity/Trabalho";

export default class TrabalhoController {
  private validateInputs(
    titulo: string,
    area: string,
    codigo: string,
    autores: any[]
  ): string[] {
    const mensagensDeErro: string[] = [];

    if (!titulo || titulo.trim().length === 0) {
      mensagensDeErro.push("O título do trabalho não pode ser vazio");
    }

    const areasValidas = ["CAE", "CET", "CBS", "CHCSA", "MDIS"];
    if (!area || !areasValidas.includes(area)) {
      mensagensDeErro.push("A área do trabalho deve ser uma dentre as opções: CAE, CET, CBS, CHCSA e MDIS.");
    }

    if (!codigo || !/^[A-Z]{3}\d{2}$/.test(codigo)) {
      mensagensDeErro.push("O código do trabalho deve ser composto pelo código da área seguido por 2 dígitos.");
    }

    if (!autores || !Array.isArray(autores) || autores.length < 2 || autores.length > 7) {
      mensagensDeErro.push("O trabalho deve conter entre 2 e 7 autores");
    } else {
      for (let i = 0; i < autores.length; i++) {
        const autor = autores[i];
        
        if (!autor.nome || autor.nome.trim().split(" ").length < 2) {
          mensagensDeErro.push("Os nomes dos autores devem conter nome e sobrenome.");
        }
        
        if (!autor.genero || !['M', 'F'].includes(autor.genero)) {
          mensagensDeErro.push("O gênero de cada autor deve ser uma dentre as opções M ou F.");
        }
        
        if (!autor.cpf || !/^\d{11}$/.test(autor.cpf)) {
          mensagensDeErro.push("O CPF de cada autor deve conter 11 dígitos e não possuir máscara.");
        }
      }
    }

    return mensagensDeErro;
  }

  async salvar(req: Request, res: Response) {
    const { titulo, area, codigo, autores } = req.body;

    const mensagensDeErro = this.validateInputs(titulo, area, codigo, autores);

    if (mensagensDeErro.length > 0) {
      return res.status(400).json({ mensagensDeErro });
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
  async buscarPorArea(req: Request, res: Response) {
    const { codArea } = req.params;

    try {
      const areasValidas = ["CAE", "CET", "CBS", "CHCSA", "MDIS"];
      if (!areasValidas.includes(codArea)) {
        return res.status(200).json({ trabalhos: [] });
      }

      const trabalhos = await AppDataSource.getRepository(Trabalho).find({
        where: { area: codArea },
      });

      return res.status(200).json({ trabalhos });
    } catch (error) {
      console.error("Erro ao buscar trabalhos:", error);
      return res.status(500).json({ erro: "Erro interno do servidor" });
    }
  }

}

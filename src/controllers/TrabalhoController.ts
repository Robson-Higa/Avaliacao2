import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Autor } from "../entity/Autor";
import { Trabalho } from "../entity/Trabalho";
import Area  from "../entity/Area"; 

export default class TrabalhoController {
  async salvar(req: Request, res: Response) {
    const {id, titulo, area, codigo, autores } = req.body;


    if (id && titulo && area && codigo && autores && autores.length !== 0) {
      return res.status(201).json();
    }

     const mensagensDeErro: string[] = [];

    if (!titulo || titulo.trim() === 0) {
      mensagensDeErro.push("O título do trabalho não pode ser vazio");
       return res.status(400).json({ mensagensDeErro });
    }

    if (autores.length > 7) {
      mensagensDeErro.push("O trabalho deve conter entre 2 e 7 autores",);
      return res.status(400).json({ mensagensDeErro });  
    }

    if (autores.length < 2) {
       mensagensDeErro.push("O trabalho deve conter entre 2 e 7 autores",);
      return res.status(400).json({ mensagensDeErro }); 
    }

    for (const autor of autores) {
      

      const autorNome = autor.nome.trim().split(/\s+/);
      if (autorNome.length < 2) {
        mensagensDeErro.push("Os nomes dos autores devem conter nome e sobrenome.",);
        return res.status(400).json({ mensagensDeErro });
      }

      if (!autor.cpf || autor.cpf.length !== 11 ) {
        mensagensDeErro.push("O CPF de cada autor deve conter 11 dígitos e não possuir máscara.",);
        return res.status(400).json({ mensagensDeErro });
      }

      if (!autor.genero || autor.genero !== 'M' && autor.genero !== 'F') {
         mensagensDeErro.push("O gênero de cada autor deve ser uma dentre as opções M ou F.",);
        return res.status(400).json({ mensagensDeErro });
      }
    }

    if (!area || !Object.values(Area).includes(area)) {
       mensagensDeErro.push( "A área do trabalho deve ser uma dentre as opções: CAE, CET, CBS, CHCSA e MDIS.",);
      return res.status(400).json({ mensagensDeErro });
    }

    const codRegex = new RegExp(`^${area}\\d{2}$`)
    if (!codigo.startsWith(area) || !codRegex.test(codigo)) {
       mensagensDeErro.push("O código do trabalho deve ser composto pelo código da área seguido por 2 dígitos.",
);
      return res.status(400).json({ mensagensDeErro });
    }
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        
        const autoresSalvos: Autor[] = [];

        for (const autorData of autores) {
          const autor = new Autor();
          Object.assign(autor, autorData);
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



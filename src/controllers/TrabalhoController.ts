import { Request, Response } from "express";
import { TrabalhoDAO } from "../dao/TrabalhoDAO";

export default class TrabalhoController {
  private trabalhoDAO: TrabalhoDAO;

  constructor() {
    this.trabalhoDAO = new TrabalhoDAO();
  }

  async save(req: Request, res: Response) {
    const { titulo, area, codigo, autores } = req.body;

    const trabalho = new TrabalhoDAO({});
  }
}

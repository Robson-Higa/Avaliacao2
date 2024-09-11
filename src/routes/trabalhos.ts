/* eslint-disable prettier/prettier */
/* eslint-disable import/no-named-as-default */
import { Router } from "express";
// eslint-disable-next-line import/no-named-as-default-member
import TrabalhoController from "../controllers/TrabalhoController";

const trabalhosRouter = Router();

const trabalhoCtrl = new TrabalhoController();

trabalhosRouter.post("/", (req, res) => trabalhoCtrl.salvar(req, res));
trabalhosRouter.get("/area/:codArea", (req, res) =>
  trabalhoCtrl.buscarPorArea(req, res),
);
trabalhosRouter.get("/area/:codArea", (req, res) =>
  trabalhoCtrl.areaInvalida(req, res),
);

export default trabalhosRouter;

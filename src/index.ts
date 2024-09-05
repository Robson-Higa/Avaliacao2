import { AppDataSource } from "./data-source";
import Area from "./entity/Area";
import { Autor } from "./entity/Autor";
import Genero from "./entity/Genero";
import { Trabalho } from "./entity/Trabalho";

(async () => {
  await AppDataSource.initialize();
  const autorRepo = AppDataSource.getRepository(Autor);
  const trabalhoRepo = AppDataSource.getRepository(Trabalho);

  let autores = await autorRepo.find();
  await autorRepo.softRemove(autores);
  let trabalhos = await trabalhoRepo.find();

  console.log(trabalhos);
  console.log(autores);

  const autor1 = new Autor();
  autor1.genero = Genero.F;
  autor1.nome = "Suelen Oliveira";
  autor1.cpf = "99999999999";
  await autorRepo.save(autor1);
  console.log("Autor 1 salvo");

  const autor2 = new Autor();
  autor2.genero = Genero.M;
  autor2.nome = "Sidney Sousa";
  autor2.cpf = "77777777777";
  await autorRepo.save(autor2);
  console.log("Autor 2 salvo");

  const trabalho1 = new Trabalho();
  trabalho1.area = Area.CAE;
  trabalho1.titulo = "Medida do pé direito da parede";
  trabalho1.autores = [autor1, autor2];
  await trabalhoRepo.save(trabalho1);
  console.log("Trabalho 1 salvo");

  const trabalho2 = new Trabalho();
  trabalho2.area = Area.CBS;
  trabalho2.titulo = "Altura das borboletas";
  trabalho2.autores = [autor1];
  await trabalhoRepo.save(trabalho2);
  console.log("Trabalho 2 salvo");

  trabalhos = await trabalhoRepo.find();
  console.log(trabalhos);

  autores = await autorRepo.find();
  console.log(autores);
})();

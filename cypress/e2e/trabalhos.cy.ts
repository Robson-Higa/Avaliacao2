/* eslint-disable prefer-arrow-callback */
const requestOptions: Partial<Cypress.RequestOptions> = {
  method: "POST",
  url: "/trabalhos",
  failOnStatusCode: false,
};

describe("Testes sobre o endpoint /trabalhos", () => {
  before(() => {
    cy.fixture("trabalho").as("trabalho");
    cy.fixture("trabalho_com_area_invalida").as("trabalhoComAreaInvalida");
    cy.fixture("trabalho_com_autor_com_cpf_invalido").as(
      "trabalhoComAutorComCPFInvalido",
    );
    cy.fixture("trabalho_com_autor_com_genero_invalido").as(
      "trabalhoComAutorComGeneroInvalido",
    );
    cy.fixture("trabalho_com_autor_com_nome_invalido").as(
      "trabalhoComAutorComNomeInvalido",
    );
    cy.fixture("trabalho_com_codigo_invalido").as("trabalhoComCodigoInvalido");
    cy.fixture("trabalho_com_mais_de_sete_autores").as(
      "trabalhoComMaisDeSeteAutores",
    );
    cy.fixture("trabalho_com_um_autor").as("trabalhoComUmAutor");
    cy.fixture("trabalho_sem_titulo").as("trabalhoSemTitulo");
  });

  test("deve salvar um trabalho com dados válidos", function () {
    requestOptions.body = this.trabalho;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(201);
      const { trabalho } = res.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(trabalho.id).to.not.null;
    });
  });

  test("não deve salvar um trabalho com título vazio ou nulo", function () {
    requestOptions.body = this.trabalhoSemTitulo;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O título do trabalho não pode ser vazio",
      );
    });
  });

  test("não deve salvar um trabalho com menos de 2 autores", function () {
    requestOptions.body = this.trabalhoComUmAutor;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O trabalho deve conter entre 2 e 7 autores",
      );
    });
  });

  test("não deve salvar um trabalho com mais de 7 autores", function () {
    requestOptions.body = this.trabalhoComMaisDeSeteAutores;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O trabalho deve conter entre 2 e 7 autores",
      );
    });
  });

  test("não deve salvar um trabalho com uma área inválida", function () {
    requestOptions.body = this.trabalhoComAreaInvalida;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "A área do trabalho deve ser uma dentre as opções: CAE, CET, CBS, CHCSA e MDIS.",
      );
    });
  });

  test("não deve salvar um trabalho com um código inválido", function () {
    requestOptions.body = this.trabalhoComCodigoInvalido;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O código do trabalho deve ser composto pelo código da área seguido por 2 dígitos.",
      );
    });
  });

  test("não deve salvar um trabalho com autor com nome inválido", function () {
    requestOptions.body = this.trabalhoComAutorComNomeInvalido;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "Os nomes dos autores devem conter nome e sobrenome.",
      );
    });
  });

  test("não deve salvar um trabalho com autor com gênero inválido", function () {
    requestOptions.body = this.trabalhoComAutorComGeneroInvalido;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O gênero de cada autor deve ser uma dentre as opções M ou F.",
      );
    });
  });

  test("não deve salvar um trabalho com autor com CPF inválido", function () {
    requestOptions.body = this.trabalhoComAutorComCPFInvalido;

    cy.request(requestOptions).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O CPF de cada autor deve conter 11 dígitos e não possuir máscara.",
      );
    });
  });
});

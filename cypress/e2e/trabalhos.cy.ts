/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-arrow-callback */
const requestOptionsPOST: Partial<Cypress.RequestOptions> = {
  method: "POST",
  url: "/trabalhos",
  failOnStatusCode: false,
};

describe("Testes sobre o endpoint POST /trabalhos", () => {
  before(() => {
    cy.task("limparBancoDeDados");
  });

  it("deve salvar um trabalho com dados válidos", function () {
    cy.fixture("trabalho").then((trabalho) => {
      requestOptionsPOST.body = trabalho;

      cy.request(requestOptionsPOST).then((res) => {
        expect(res.status).to.equal(201);
        const { trabalho } = res.body;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(trabalho.id).to.not.null;
      });
    });
  });

  it("não deve salvar um trabalho com título vazio ou nulo", function () {
    cy.fixture("trabalho_sem_titulo").then((trabalhoSemTitulo) => {
      requestOptionsPOST.body = trabalhoSemTitulo;

      cy.request(requestOptionsPOST).then((res) => {
        expect(res.status).to.equal(400);
        const { mensagensDeErro } = res.body;
        expect(mensagensDeErro[0]).to.equal(
          "O título do trabalho não pode ser vazio",
        );
      });
    });
  });

  it("não deve salvar um trabalho com menos de 2 autores", function () {
    cy.fixture("trabalho_com_um_autor").then(
      (trabalhoComMenosDeDoisAutores) => {
        requestOptionsPOST.body = trabalhoComMenosDeDoisAutores;

        cy.request(requestOptionsPOST).then((res) => {
          expect(res.status).to.equal(400);
          const { mensagensDeErro } = res.body;
          expect(mensagensDeErro[0]).to.equal(
            "O trabalho deve conter entre 2 e 7 autores",
          );
        });
      },
    );
  });

  it("não deve salvar um trabalho com mais de 7 autores", function () {
    cy.fixture("trabalho_com_mais_de_sete_autores").then(
      (trabalhoComMaisDeSeteAutores) => {
        requestOptionsPOST.body = trabalhoComMaisDeSeteAutores;

        cy.request(requestOptionsPOST).then((res) => {
          expect(res.status).to.equal(400);
          const { mensagensDeErro } = res.body;
          expect(mensagensDeErro[0]).to.equal(
            "O trabalho deve conter entre 2 e 7 autores",
          );
        });
      },
    );
  });

  it("não deve salvar um trabalho com uma área inválida", function () {
    cy.fixture("trabalho_com_area_invalida").then((trabalhoComAreaInvalida) => {
      requestOptionsPOST.body = trabalhoComAreaInvalida;

      cy.request(requestOptionsPOST).then((res) => {
        expect(res.status).to.equal(400);
        const { mensagensDeErro } = res.body;
        expect(mensagensDeErro[0]).to.equal(
          "A área do trabalho deve ser uma dentre as opções: CAE, CET, CBS, CHCSA e MDIS.",
        );
      });
    });
  });

  it("não deve salvar um trabalho com um código inválido", function () {
    cy.fixture("trabalho_com_codigo_invalido").then(
      (trabalhoComCodigoInvalido) => {
        requestOptionsPOST.body = trabalhoComCodigoInvalido;

        cy.request(requestOptionsPOST).then((res) => {
          expect(res.status).to.equal(400);
          const { mensagensDeErro } = res.body;
          expect(mensagensDeErro[0]).to.equal(
            "O código do trabalho deve ser composto pelo código da área seguido por 2 dígitos.",
          );
        });
      },
    );
  });

  it("não deve salvar um trabalho com autor com nome inválido", function () {
    cy.fixture("trabalho_com_autor_com_nome_invalido").then(
      (trabalhoComAutorComNomeInvalido) => {
        requestOptionsPOST.body = trabalhoComAutorComNomeInvalido;

        cy.request(requestOptionsPOST).then((res) => {
          expect(res.status).to.equal(400);
          const { mensagensDeErro } = res.body;
          expect(mensagensDeErro[0]).to.equal(
            "Os nomes dos autores devem conter nome e sobrenome.",
          );
        });
      },
    );
  });

  it("não deve salvar um trabalho com autor com gênero inválido", function () {
    cy.fixture("trabalho_com_autor_com_genero_invalido").then(
      (trabalhoComAutorComGeneroInvalido) => {
        requestOptionsPOST.body = trabalhoComAutorComGeneroInvalido;

        cy.request(requestOptionsPOST).then((res) => {
          expect(res.status).to.equal(400);
          const { mensagensDeErro } = res.body;
          expect(mensagensDeErro[0]).to.equal(
            "O gênero de cada autor deve ser uma dentre as opções M ou F.",
          );
        });
      },
    );
  });

  it("não deve salvar um trabalho com autor com CPF inválido", function () {
    cy.fixture("trabalho_com_autor_com_cpf_invalido").then(
      (trabalhoComAutorComCpfInvalido) => {
        requestOptionsPOST.body = trabalhoComAutorComCpfInvalido;

        cy.request(requestOptionsPOST).then((res) => {
          expect(res.status).to.equal(400);
          const { mensagensDeErro } = res.body;
          expect(mensagensDeErro[0]).to.equal(
            "O CPF de cada autor deve conter 11 dígitos e não possuir máscara.",
          );
        });
      },
    );
  });
});

/* eslint-disable prefer-arrow-callback */
let requestOptionsGET: Partial<Cypress.RequestOptions> = {};

describe("Testes sobre o endpoint GET /trabalhos/area/:codArea", () => {
  before(() => {
    cy.task("limparBancoDeDados");
    cy.task("popularBancoDeDados");
  });

  beforeEach(() => {
    requestOptionsGET = {
      method: "GET",
      url: "/trabalhos/area/:codArea",
      failOnStatusCode: false,
    };
  });

  it("deve recuperar todos os trabalhos de uma determinada área válida", () => {
    const codArea = "CET";
    requestOptionsGET.url = requestOptionsGET.url.replace(":codArea", codArea);

    cy.request(requestOptionsGET).then((res) => {
      expect(res.status).to.equal(200);
      const { trabalhos } = res.body;

      expect(trabalhos.length).to.greaterThan(0);

      for (let i = 0; i < trabalhos.length; i++) {
        expect(trabalhos[i].area).to.equal(codArea);
      }
    });
  });

  it("não deve recuperar trabalhos de uma área inválida", () => {
    const codArea = "Saúde";
    requestOptionsGET.url = requestOptionsGET.url.replace(":codArea", codArea);

    cy.request(requestOptionsGET).then((res) => {
      expect(res.status).to.equal(200);
      const { trabalhos } = res.body;

      expect(trabalhos.length).to.equal(0);
    });
  });
});

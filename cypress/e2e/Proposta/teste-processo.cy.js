const url = "http://localhost:8443/sod"

describe("Proposta Endpoint - Teste de Processo", () => {
    const pessoaLogin = {
        senha: 123,
        email: "romario@weg.net"
    };
    let headers = {
        'Cookie': ""
    };
    const urlProposta = url + "/proposta";
    const propostaCadastrada = {
        "escopo": "hum, é viável, bora ver no que da",
        "periodoExecucaoInicio": "2023-07-12",
        "periodoExecucaoFim": "2023-07-22",
        "demanda": {
            "idDemanda": 15
        },
        "responsaveisNegocio": [
            {
                "idUsuario": 3
            },
            {
                "idUsuario": 5
            }
        ],
        "tabelasCustoProposta": [
            {
                "tituloTabela": "despesas iniciais",
                "quantidadeTotal": 90,
                "valorTotal": 960,
                "licenca": false,
                "centrosCustoPagantes": [
                    {
                        "centroCusto": {
                            "idCentroCusto": 3
                        },
                        "porcentagemDespesa": 0.4
                    },
                    {
                        "centroCusto": {
                            "idCentroCusto": 1
                        },
                        "porcentagemDespesa": 0.6
                    }
                ],
                "linhasTabela": [
                    {
                        "nomeRecurso": "trabalho",
                        "quantidade": 40,
                        "valorQuantidade": 9
                    },
                    {
                        "nomeRecurso": "trabalho2",
                        "quantidade": 50,
                        "valorQuantidade": 12
                    }
                ]
            }
        ]
    };

    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    Cypress.Commands.add('fileRequest', (filePath, requestOptions) => {
        return cy
            .fixture(filePath, 'binary').then(file => {
                const blob = Cypress.Blob.binaryStringToBlob(file);
                const formData = new FormData();
                formData.append("proposta", JSON.stringify(propostaCadastrada))
                formData.set('pdfVersaoHistorico', blob);

                return cy.request({
                    ...requestOptions,
                    body: formData,
                });
            }).then(response => {
                console.log(">>>>>>>> PROPOSTA: \n", response);
            });
    });

    it("Cadastrar Proposta", () => {
        cy.fileRequest('../e2e/Assets/pdf.pdf', {
            method: 'POST',
            url: urlProposta + "/3",
            headers
        });
    });

    it("Editar centro de custo", () => {
        cy.request({
            method: 'PUT',
            url: urlProposta,
            headers
        }).then(response => {
            console.log(response);
        });

        cy.request("PUT", urlProposta + "/2/3").as("TodoRequest");
        cy.get("@TodoRequest").then(response => {
            console.log(">>>>>>>> PROPOSTAS: \n", response.body)
            expect(response.status).to.eq(200);
        });
    });
});

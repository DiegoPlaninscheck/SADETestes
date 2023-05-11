describe("Proposta Endpoint - Teste de Processo", () => {
    const url = "http://localhost:8443/sod"
    const urlProposta = url + "/proposta";
    let headers = {
        'Cookie': ""
    };
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
    let propostaCadastrada = {
        "escopo": "hum, é viável, bora ver no que da",
        "periodoExecucaoInicio": "2023-07-12",
        "periodoExecucaoFim": "2023-07-22",
        "demanda": {
            "idDemanda": 2
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
    let idProposta = 0;


    Cypress.Commands.add('fileRequest', (filePath, requestOptions) => {
        return cy
            .fixture(filePath, 'binary').then(file => {
                const blob = Cypress.Blob.binaryStringToBlob(file);
                const formData = new FormData();
                formData.append("proposta", JSON.stringify(propostaCadastrada));
                formData.set('pdfVersaoHistorico', blob);

                return cy.request({
                    ...requestOptions,
                    body: formData,
                });
            }).then(response => {
                const dec = new TextDecoder();
                propostaCadastrada = JSON.parse(dec.decode(response.body));

                idProposta = propostaCadastrada.idProposta;
            });
    });

    Cypress.Commands.add('deleteProposta', () => {
        cy.request("DELETE", urlProposta + "/" + idProposta).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.duration).to.be.lte(1000);
            });
    });

    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
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
        let propostaEditar = {
            "idProposta": propostaCadastrada.idProposta,
            "tabelasCustoProposta": propostaCadastrada.tabelasCustoProposta
        };

        for (let tabela of propostaEditar.tabelasCustoProposta) {
            for (let centroCusto of tabela.centrosCustoPagantes) {
                centroCusto.centroCusto.idCentroCusto = 2;
                centroCusto.porcentagemDespesa = 0.5;
            };
        };

        propostaCadastrada = propostaEditar;

        cy.fileRequest('../e2e/Assets/pdf.pdf', {
            method: "PUT",
            url: urlProposta + "/" + idProposta + "/3",
            headers
        });
    });

    it("Verificar se centros de custo atualizaram", () => {
        cy.request({
            method: "GET",
            url: urlProposta + "/" + idProposta,
            headers
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.tabelasCustoProposta[0].centrosCustoPagantes[0].centroCusto.idCentroCusto).to.eq(2);
        });

        cy.deleteProposta();
    });

});
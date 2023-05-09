const url = "http://localhost:8443/sod"

describe("Demanda EndPoint - Teste de carga", () => {
    const urlDemanda = url + "/demanda"
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    }
    let headers = {
        'Cookie': ""
    }
    let demandaObject = {
        "tituloDemanda": "titulo demanda novo teste historico 5",
        "objetivo": "Um novo objetivo novo2",
        "situacaoAtual": "Situação",
        "frequenciaUso": "SEMANALMENTE",
        "score": 17,
        "centroCustoDemanda": [
            {
                "idCentroCusto": 1
            },
            {
                "idCentroCusto": 3
            }
        ],
        "beneficiosDemanda": [
            {
                "tipoBeneficio": "QUALITATIVO",
                "descricao": "dá bastante dinheiro pq sim"
            },
            {
                "tipoBeneficio": "REAL",
                "descricao": "é bom joia",
                "moeda": "EURO",
                "valor": 87
            }
        ],
        "usuario": {
            "idUsuario": 2
        }
    }

    Cypress.Commands.add('fileRequest', (filePath, requestOptions) => {
        return cy
            .fixture(filePath, 'binary')
            .then(file => {
                const blob = Cypress.Blob.binaryStringToBlob(file);
                const formData = new FormData();
                formData.append("demanda", JSON.stringify(demandaObject))
                formData.set('pdfVersaoHistorico', blob);
                
                return cy.request({
                    ...requestOptions,
                    body: formData,
                });
            })
            .then(response => {
                expect(response.status).to.eq(200)
                expect(response.duration).to.be.lte(1000)

                const dec = new TextDecoder();
                demandaObject = JSON.parse(dec.decode(response.body));
            });
    });

    Cypress.Commands.add('deleteDemand', () => {
        cy.request("DELETE", urlDemanda + "/" + demandaObject.idDemanda)
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.duration).to.be.lte(1000)
            })
    });


    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest")
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value
            cy.setCookie("jwt", headers['Cookie'])
        })
    })

    it("Criar uma demanda", () => {
        cy.fileRequest('../e2e/Assets/teste-arquivo.png', {
            method: 'POST',
            url: urlDemanda,
            headers
        })
    })

    it("Classificar uma demanda", () => {
        demandaObject = {
            ...demandaObject,
            "tamanho": "MUITOPEQUENO",
            "busolicitante": {
                "idBU": 2
            },
            "busBeneficiadas": [
                {
                    "idBU": 5
                },
                {
                    "idBU": 1
                }
            ],
            "secaoTIResponsavel": "STD",
            "classificando": true
        }

        cy.fileRequest('../e2e/Assets/teste-arquivo.png', {
            method: 'PUT',
            url: urlDemanda + "/" + demandaObject.idDemanda + "/3",
            headers
        })
    })

    it("Adicionar informações em uma demanda", () => {
        demandaObject = {
            ...demandaObject,
            "prazoElaboracao": "2023-03-10",
            "codigoPPM": 34657 ,
            "linkJira": "https://jira/gfdapishdfogasd",
            "adicionandoInformacoes": true,
            "statusDemanda": "ASSESMENT"
        }

        cy.fileRequest('../e2e/Assets/teste-arquivo.png', {
            method: 'PUT',
            url: urlDemanda + "/" + demandaObject.idDemanda + "/3",
            headers
        })

        cy.deleteDemand()
    })

})
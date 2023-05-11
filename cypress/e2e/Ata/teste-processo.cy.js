describe("ATA EndPoint - Teste de processo", () => {
    const url = "localhost:8443/sod";
    let headers = {
        'Cookie': ""
    };
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
    let ataObject = {
        "pauta": {
            "idPauta": 1
        },
        "tituloReuniaoATA": "Título da reunião da ata",
        "dataReuniao": "2023-06-06",
        "inicioReuniao": "14:20:00",
        "finalReuniao": "15:30:00",
        "usuariosReuniaoATA": [
            {
                "idUsuario": 6
            }
        ]
    };


    Cypress.Commands.add('deleteAta', () => {
        cy.request("DELETE", url + "/ata/" + ataObject.idATA).then((response) => {
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

    it("Cadastrar ATA", () => {
        cy.request({
            method: "POST",
            url: `${url}/ata`,
            body: ataObject,
            headers
        }).then((res) => {
            expect(res.body).to.not.null;
            expect(res.status).to.eq(200);

            ataObject = res.body;
        });
    });

    it("Adicionar o parecer da Direção Geral na ATA", () => {
        ataObject = {
            "idATA": ataObject.idATA,
            "numeroAno": 2023,
            "numeroDG": 35243543543,
            "propostasAta": [
                {
                    "numeroSequencial": 333,
                    "statusDemandaComissao": "BUSINESSCASE",
                    "comentario": "comentario ae, joia",
                    "proposta": {
                        "idProposta": 15
                    }
                },
            ]
        };

        const formData = new FormData();
        formData.append("ata", JSON.stringify(ataObject));

        cy.request({
            method: "PUT",
            url: `${url}/ata/${ataObject.idATA}/3`,
            body: formData,
            headers
        }).then((res) => {
            expect(res.body).to.not.null;
            expect(res.status).to.eq(200);
        });

        cy.deleteAta();
    });

});
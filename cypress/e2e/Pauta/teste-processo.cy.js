describe("Pauta EndPoint - Teste de Processo", () => {
    const url = "localhost:8443/sod"

    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    }

    let headers = {
        'Cookie': ""
    }

    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest")
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value
            cy.setCookie("jwt", headers['Cookie'])
        })
    })

    let pautaDTO = {
        "tituloReuniaoPauta": "Título da reunião da pauta",
        "dataReuniao": "2023-09-09",
        "inicioReuniao": "13:30:00",
        "finalReuniao": "15:00:00",
        "forum": {
            "idForum": 8
        },
        "propostasPauta": [
            {
                "proposta": {
                    "idProposta": 4
                }
            }
        ]
    }

    it("Cadastrar Pauta no banco", () => {
        cy.request({
            method: "POST",
            url: `${url}/pauta/3`,
            body: pautaDTO,
            headers
        }).then((res) => {
            console.log(res);
            expect(res.status).to.eq(200)
            expect(res.body.length).to.be.gte(0)
        });

    })

})
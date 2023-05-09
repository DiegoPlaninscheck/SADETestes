describe("ATA EndPoint - Teste de processo", () => {
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

    let pauta = {
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
            },
            {
                "idUsuario": 4
            }
        ]
    }

    let idATA;

    it("Cadastrar ATA", () => {
        cy.request({
            method: "POST",
            url: `${url}/ata`,
            body: pauta,
            headers
        }).then((res) => {
            expect(res.body).to.not.null
            expect(res.status).to.eq(200)
            console.log(res);
            idATA = res.body.idATA;
        });
    })

    const formData = new FormData();

    let ATAEditada = {
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
    }

    formData.append("ata", JSON.stringify(ATAEditada));

    it("Colocar o parecer da Direção Geral na ATA", () => {

        cy.request({
            method: "PUT",
            url: `${url}/ata/${idATA}/1`,
            body: formData,
            headers
        }).then((res) => {
            expect(res.body).to.not.null
            expect(res.status).to.eq(200)
            console.log(res);
        });

        // cy.request("DELETE", url + `/ata/${idATA}`).then((res) => {
        //     console.log(res);
        // })
    })

})
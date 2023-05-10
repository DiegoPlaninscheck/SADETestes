describe("Pauta EndPoint - Teste de Processo", () => {
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
    const url = "localhost:8443/sod";
    let headers = {
        'Cookie': ""
    };
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
                "idProposta": 4
            }
        ],
        "teste": true
    };
    let idPauta;


    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it("Cadastrar Pauta", () => {
        cy.request({
            method: "POST",
            url: `${url}/pauta/3`,
            body: pautaDTO,
            headers
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.not.null;

            pautaDTO.propostasPauta = res.body.propostasPauta;
            idPauta = res.body.idPauta;
        });

    });

    it("Colocar o parecer da Comissão na Pauta", () => {
        const formData = new FormData();
        const listaDecisoesPropostaspauta = [];
        let pautaEdicaoDTO = {
            "dataReuniaoATA": "2024-12-03",
            "propostasPauta": listaDecisoesPropostaspauta,
            "teste": true
        };

        for (let decisaoProposta of pautaDTO.propostasPauta) {
            let infoDecisao = {
                idDecisaoPropostaPauta: decisaoProposta.idDecisaoPropostaPauta,
                "statusDemandaComissao": "TODO",
                "ataPublicada": false,
                "comentario": "comentario fodao sifnwuybgrv"
            };

            listaDecisoesPropostaspauta.push(infoDecisao);
        }

        formData.append("pauta", JSON.stringify(pautaEdicaoDTO));

        cy.request({
            method: "PUT",
            url: `${url}/pauta/${idPauta}/3`,
            body: formData,
            headers
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.not.null;
        });

        //consultar a pauta para ver se os pareceres das propostas foram atualizados

        cy.request({
            method: "DELETE",
            url: `${url}/pauta/${idPauta}`,
            headers
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.eq("Pauta deletada com sucesso!");
        });

    });

});
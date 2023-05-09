describe("Pauta EndPoint - Teste de Integração", () => {
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

    it("Selecionar todos os arquivos das Pautas do banco 50 vezes", () => {
        for (let i = 0; i < 50; i++) {
            cy.request({
                method: "GET",
                url: `${url}/pauta/arquivos/pautas`,
                headers
            }).then((res) => {
                console.log(res.duration);
                expect(res.status).to.eq(200)
                expect(res.duration).to.be.lte(1000)
                expect(res.body.length).to.be.gte(0)
            });
        }
    })

})
const url = "http://localhost:8443/sod"

describe("Demanda EndPoint - Teste de carga", () => {
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


    it("Requisição para pegar todas as demandas do sistema", () => {
        cy.request({
            method: 'GET',
            url: url + "/demanda/usuario/6",
            headers
        }).as("TodoRequest")
        cy.get("@TodoRequest").then((response) => {
            expect(response.status).to.eq(200)
            expect(response.duration).to.be.lte(1000)
        })


    })

})


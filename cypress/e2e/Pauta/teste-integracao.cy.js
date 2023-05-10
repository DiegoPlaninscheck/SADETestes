describe("Pauta EndPoint - Teste de Integração", () => {
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
    const url = "localhost:8443/sod"
    let headers = {
        'Cookie': ""
    };


    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it("Buscar todos as Pautas do banco", () => {
        cy.request({
            method: "GET",
            url: `${url}/pauta`,
            headers
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.length).to.be.gte(0);
        });
    });

});
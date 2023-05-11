describe("Proposta Endpoint - Teste de Integração", () => {
    const url = "http://localhost:8443/sod";
    const urlProposta = url + "/proposta";
    let headers = {
        'Cookie': ""
    };
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };


    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it("Pegar todas as proposta que não estão em uma pauta", () => {
        cy.request({
            method: 'GET',
            url: urlProposta + "/pauta/false",
            headers
        }).as("TodoRequest");
        cy.get("@TodoRequest").then(response => {
            expect(response.status).to.eq(200);
        });
    });

});
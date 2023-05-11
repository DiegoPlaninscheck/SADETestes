describe("Proposta Endpoint - Teste de Carga", () => {
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

    for (let i = 0; i < 200; i++) {
        it("Buscar proposta, nº: " + (i + 1), () => {
            cy.request({
                method: 'GET',
                url: urlProposta + "/1",
                headers
            }).as("TodoRequest");
            cy.get("@TodoRequest").then(response => {
                expect(response.status).to.eq(200);
                expect(response.duration).to.be.lte(1000);
            });
        });
    };

});
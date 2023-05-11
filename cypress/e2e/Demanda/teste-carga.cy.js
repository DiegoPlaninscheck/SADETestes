describe("Demanda EndPoint - Teste de carga", () => {
    const url = "http://localhost:8443/sod";
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

    for (let i = 0; i < 100; i++) {
        it("Buscar todas as demandas do banco, nº" + (i + 1), () => {
            cy.request({
                method: 'GET',
                url: url + "/demanda",
                headers
            }).as("TodoRequest");

            cy.get("@TodoRequest").then((response) => {
                expect(response.status).to.eq(200);
                expect(response.duration).to.be.lte(1000);
            });
        });
    };

});


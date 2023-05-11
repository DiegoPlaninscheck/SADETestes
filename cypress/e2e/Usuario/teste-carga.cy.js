describe("Usuário Endpoint - Teste de Carga", () => {
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
    const url = "http://localhost:8443/sod";
    const urlUsuario = url + "/usuario";
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

    for (let i = 0; i < 200; i++) {
        it("Pegar todos os usuários, nº: " + (i + 1), () => {
            cy.request({
                method: 'GET',
                url: urlUsuario,
                headers
            }).as("TodoRequest");

            cy.get("@TodoRequest").then(response => {
                expect(response.status).to.eq(200);
                expect(response.duration).to.be.lte(1000);
            });

        });
    };

});
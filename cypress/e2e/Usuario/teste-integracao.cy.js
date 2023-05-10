describe("Usuário Endpoint - Teste de Integração", () => {
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
    const url = "http://localhost:8443/sod";
    let headers = {
        'Cookie': ""
    };

    it('Fazer login com o usuário', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });
    
});
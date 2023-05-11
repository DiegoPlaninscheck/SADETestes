describe("ATA EndPoint - Teste de Integração", () => {
    const url = "localhost:8443/sod";
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

    it("Buscar todas as ATAs do banco", () => {
        cy.request({
            method: "GET",
            url: `${url}/ata`,
            headers
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.length).to.be.gte(0);
        });
    });

});
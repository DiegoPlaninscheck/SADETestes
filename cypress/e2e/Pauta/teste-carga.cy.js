describe("Pauta EndPoint - Teste de Carga", () => {
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

    for (let i = 0; i < 50; i++) {
        it("Buscar todos os arquivos das Pautas, nº: " + (i + 1), () => {
            cy.request({
                method: "GET",
                url: `${url}/pauta/arquivos/pautas`,
                headers
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.duration).to.be.lte(1000);
                expect(res.body.length).to.be.gte(0);
            });
        });
    };

});
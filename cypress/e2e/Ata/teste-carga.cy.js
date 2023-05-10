describe("ATA EndPoint - Teste de Carga", () => {
    const url = "localhost:8443/sod";
    const pessoaLogin = {
        senha: 123,
        email: "romario@gmail.com"
    };
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

    //fzaer for com it dentro
    it("Buscar todas as ATAs do banco 100 vezes", () => {
        for (let i = 0; i < 100; i++) {
            cy.request({
                method: "GET",
                url: `${url}/ata`,
                headers
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.duration).to.be.lte(1000);
            });
        }
    });

});
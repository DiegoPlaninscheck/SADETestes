const url = "http://localhost:8443/sod"

describe("Proposta Endpoint - Teste de Carga", () => {
    const pessoaLogin = { 
        senha: 123, 
        email: "romario@weg.net" 
    };
    let headers = { 
        'Cookie': "" 
    };
    const urlProposta = url + "/proposta";

    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it("Pegar uma proposta", () => {
        cy.request({
            method: 'GET',
            url: urlProposta,
            headers
        }).then(response => {
            console.log(response);
        });

        for (let i = 0; i < 200; i++) {
            cy.request("GET", urlProposta + "/1").as("TodoRequest");
            cy.get("@TodoRequest").then(response => {
                expect(response.status).to.eq(200);
                expect(response.duration).to.be.lte(1000);
            });
        };
    });
});
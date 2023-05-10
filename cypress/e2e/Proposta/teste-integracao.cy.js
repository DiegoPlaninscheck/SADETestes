const url = "http://localhost:8443/sod"

describe("Proposta Endpoint - Teste de Integração", () => {
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

    it("Pegar todas as proposta que não estão em uma pauta", () => {
        cy.request({
            method: 'GET',
            url: urlProposta,
            headers
        }).then(response => {
            console.log(response);
        });

        cy.request("GET", urlProposta + "/pauta/false").as("TodoRequest");
        cy.get("@TodoRequest").then(response => {
            console.log(">>>>>>>> PROPOSTAS: \n", response.body)
            expect(response.status).to.eq(200);
        });
    });
});
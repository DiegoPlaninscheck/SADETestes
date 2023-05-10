const url = "http://localhost:8443/sod"

describe("Usuário Endpoint - Teste de Carga", () => {
    const pessoaLogin = { 
        senha: 123, 
        email: "romario@weg.net" 
    };
    let headers = { 
        'Cookie': "" 
    };
    const urlUsuario = url + "/usuario";

    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it("Pegar todos os usuários", () => {
        cy.request({
            method: 'GET',
            url: urlUsuario,
            headers
        }).then(response => {
            console.log(response);
        });

        for (let i = 0; i < 200; i++) {
            cy.request("GET", urlUsuario).as("TodoRequest");
            cy.get("@TodoRequest").then(response => {
                expect(response.status).to.eq(200);
                expect(response.duration).to.be.lte(1000);
            });
        };
    });
});
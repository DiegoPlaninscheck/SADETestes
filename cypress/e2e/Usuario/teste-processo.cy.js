describe("Usuário Endpoint - Teste de Processo", () => {
    const pessoaLogin = {
        senha: 123,
        email: "romario@weg.net"
    };
    const pessoaEditada = {
        "numeroCadastro": 678,
        "nomeUsuario": "Romário",
        "departamento": "TI",
        "email": "romario@weg.net",
        "senha": "123",
        "setor": "TI",
        "cargo": "Desenvolvedor Backend",
        "notificacoesUsuario": null
    };
    const url = "http://localhost:8443/sod";
    const urlUsuario = url + "/usuario";
    let headers = {
        'Cookie': ""
    };


    Cypress.Commands.add('fileRequest', (filePath, requestOptions) => {
        return cy
            .fixture(filePath, 'binary').then(file => {
                const blob = Cypress.Blob.binaryStringToBlob(file);
                const formData = new FormData();
                formData.append("usuario", JSON.stringify(pessoaEditada));
                formData.set('foto', blob);

                return cy.request({
                    ...requestOptions,
                    body: formData,
                });
            }).then(response => {
                expect(response.status).to.eq(200);
            });
    });


    it('Pegar token de autenticação', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it("Alterar foto de perfil", () => {
        cy.fileRequest('../e2e/Assets/romario.jpeg', {
            method: 'PUT',
            url: urlUsuario + "/6",
            headers
        });
    });

    it("Ver gerente de departamento do usuário logado", () => {
        cy.request({
            method: 'GET',
            url: urlUsuario + "/gerente/departamento/TI",
            headers
        }).then(response => {
            expect(response.status).to.eq(200);
        });
    });
    
});

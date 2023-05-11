describe("Usuário Endpoint - Teste de Processo", () => {
    const pessoaLogin = {
        email: "romario@gmail.com",
        senha: 123
    };
    const pessoaCadastrada = {
        "numeroCadastro": Math.random() * 10000,
        "nomeUsuario": "Pessoa Teste",
        "departamento": "TI",
        "email": "pessoateste@gmail.com",
        "senha": "123",
        "setor": "TI",
        "cargo": "Desenvolvedor Backend",
        "notificacoesUsuario": null
    };
    const pessoaCadastrarLogin = {
        email: "pessoateste@gmail.com",
        senha: "123"
    }
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

    //fazer processo de cadastro e login com outro usuário

    let idUsuarioCadastrado;
    it('Cadastrar uma nova pessoa no sistema', () => {
        const formData = new FormData();

        formData.append("usuario", JSON.stringify(pessoaCadastrada));

        cy.request({
            method: "POST",
            url: `${urlUsuario}/${1}`,
            body: formData,
            headers
        }).then((res) => {
            const dec = new TextDecoder();
            let body = JSON.parse(dec.decode(res.body));
            idUsuarioCadastrado = body.idUsuario;
            expect(body).to.not.null
            expect(res.status).to.eq(200)
        }).then(() => {
            cy.request({
                method: "GET",
                url: `${urlUsuario}/${idUsuarioCadastrado}`,
                headers
            }).then((res) => {
                expect(res.body).to.not.null;
                expect(res.status).to.eq(200)
            })
        }).then(() => {
            cy.clearCookies()
        })
    });

    it('Login com o novo usuário', () => {
        cy.request("POST", url + "/login/auth/cookie", pessoaCadastrarLogin).as("TodoRequest");
        cy.get("@TodoRequest").then((response) => {
            headers['Cookie'] = "jwt=" + response.body.value;
            cy.setCookie("jwt", headers['Cookie']);
        });
    });

    it('Deletar pessoa cadastrada', () => {
        cy.request({
            method: "DELETE",
            url: `${urlUsuario}/${idUsuarioCadastrado}`,
            headers
        }).then((res) => {
            expect(res.status).to.eq(200)
        });
    });

});

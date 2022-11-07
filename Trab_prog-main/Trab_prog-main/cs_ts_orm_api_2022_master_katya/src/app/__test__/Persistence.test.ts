import {app, setup} from "../../index"
import { afterAll, describe, expect, test } from "@jest/globals";
import supertest from "supertest";
import { getConnection} from "typeorm"

describe("persistence test", () => {

    afterAll(async () => {
        await getConnection().close()
    });

    beforeAll(async () => {
        await setup()
    });


    it('teste /patente/list e /patente/delete', async () => {
        var agent = supertest(app);
        const postList = await agent.get('/patentes');
        expect(postList.statusCode).toEqual(200);
        if (postList.body.length > 0){
        for(const e of postList.body){
           
            const data = { "id" : e.id };
            console.log("Encontrou o patente: ");
            console.log(data);
            
            const postDelete = await agent.delete('/patentes').send(data);
            
            console.log("Removeu a patente: ");
            console.log(data);

            expect(postDelete.statusCode).toEqual(204);
        }
        }else{
            const data = { "cep" :"Patente de testes", "complemento" :"402" };
            const postCreate = await agent.post('/patentes').send(data);
            
            console.log("Cadastrou a patente: ");
            console.log(postCreate);

            expect(postCreate.statusCode).toEqual(200);
        }
    });


    it('teste /jogador/list e /jogador/delete', async () => {
        var agent = supertest(app);
        const ret = await agent.get('/jogadores');
        expect(ret.statusCode).toEqual(200);

        if (ret.body.length > 0){
            console.log(`Encontrou ${ret.body.length} jogadores cadastrados.`);
            
            for(const p of ret.body){
            
                const data = { "nickname" : p.nickname };
                console.log(`Removendo o jogador ${data.nickname}.`);
                const postDeleteJogador = await agent.delete('/jogadores').send(data);
                expect(postDeleteJogador.statusCode).toEqual(204);
                //esse remocao pode gerar alguma violacao de chave, caso a patente esteja sendo referenciado por outro jogador.
                //ou aplicar a estratégia de cascade no ManytoOne
                if(typeof p.patente != 'undefined'){

                    console.log(`Removendo o patente ${p.patente.id}.`);
                    const postDeletePatente = await agent.delete('/patentes').send({ "id" : p.patente.id});
                    expect(postDeletePatente.statusCode).toEqual(204);
                }
                
            }
        }else{
            console.log("Não encontrou jogadores cadastrados, cadastrando novo jogador e patente.");
            const postCreatePatente = await agent.post('/patentes').send({"nome" : "teste"});
            expect(postCreatePatente.statusCode).toEqual(200);
            const postFindPatentes = await agent.get('/patentes').send({"nome" : "teste"});
            expect(postFindPatentes.statusCode).toEqual(200);
            //console.log(postFindPatente.body);
            const data = {"nickname": "t@g1.com",
                          "senha": "11111",
                          "pontos": 10,
                          "patente" : postFindPatentes.body[0]
                        };

            const postCreateJogador = await agent.post('/jogadores').send(data);
            expect(postCreateJogador.statusCode).toEqual(200);
        }
        });





});


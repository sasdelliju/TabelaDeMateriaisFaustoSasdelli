const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    this.on('ListaMateriais', async (req) => {

        const { Material } = this.entities;

        const id = req.data.ID;

        if (!id) {
            req.error(400, "Informe o ID");
        }

        const result = await SELECT.from(Material).where({ ID: id });

        if (!result.length) {
            req.error(404, 'Material não encontrado');
        }

        return result;
    });

    this.on('FiltroMateriais', async (req) => {

        const { Material } = this.entities;

        const qtd = req.data.qtd;

        if (!qtd || qtd <= 0) {
            req.error(400, "Informe uma quantidade válida");
        }

        const result = await SELECT
            .from(Material)
            .limit(qtd);

        return result;
    });

    this.on('CriarMaterial', async (req) => {

        const { Material } = this.entities;

        const { ID, NumMat, Nome, Descr } = req.data;

        // validações
        if (!ID || !NumMat || !Nome || !Descr) {
            req.error(400, "Preencha todos os campos");
        }

        // verifica se já existe
        const existe = await SELECT.from(Material).where({ ID });

        if (existe.length) {
            req.error(400, "Material já existe");
        }

        // cria
        const novo = { ID, NumMat, Nome, Descr };

        await INSERT.into(Material).entries(novo);

        return novo;
    });      

})
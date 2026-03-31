sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'    
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("materiaisnamespace.materiaismodule.controller.MateriaisView", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter
                .getTarget("TargetMateriaisView") //sempre alterar o target
                .attachDisplay(this.handleRouteMatched, this);
        },

        handleRouteMatched: function () {
            this.createModel(); // <-- FALTAVA ISSO            
        },

        //cria o modelg
        createModel: function () {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({

                    variavelInput: 1111111,

                    Table: [
                        {
                            ID: 1,
                            NumMat: 10,
                            Nome: "Prego",
                            Descr: "Prego p/ contruçao"
                        },
                        {
                            ID: 2,
                            NumMat: 20,
                            Nome: "Alicate",
                            Descr: "Alicate tamanho p"
                        }
                    ]
                }),
                "tableMaterial"
            );

            this.oViewModel = this.getView().getModel("tableMaterial");
        },

        onOpenDialog: function () {
            this.byId("dialogMaterial").open();
        },

        onCloseDialog: function () {
            this.byId("dialogMaterial").close();
        },

        onCriarMaterialDialog: async function () {

            const oModel = this.getOwnerComponent().getModel();

            const sID = parseInt(this.byId("inputIDialog").getValue());
            const sNumMat = parseInt(this.byId("inputNumMatDialog").getValue());
            const sNome = this.byId("inputNomeDialog").getValue();
            const sDescr = this.byId("inputDescrDialog").getValue();

            try {

                const oContext = oModel.bindContext("/CriarMaterial(...)");

                oContext.setParameter("ID", sID);
                oContext.setParameter("NumMat", sNumMat); // ✅ corrigido
                oContext.setParameter("Nome", sNome);
                oContext.setParameter("Descr", sDescr);

                await oContext.execute();

                sap.m.MessageToast.show("Material criado com sucesso");

                this.byId("dialogMaterial").close();

            } catch (err) {

                //let sMensagem = "Erro ao criar Material";

                if (err?.responseText) {
                    try {
                        sMensagem = JSON.parse(err.responseText).error.message;
                    } catch { }
                }

                MessageToast.show(err.error.message);
            }
        },

        onBuscar: async function () {
            const oModel = this.getOwnerComponent().getModel();
            const sQTD = this.byId("inputQTD").getValue();

            try {
                const oContext = oModel.bindContext(`/FiltroMateriais(qtd=${sQTD})`);

                const oData = await oContext.requestObject();

                const oJson = new sap.ui.model.json.JSONModel({
                    Table: oData.value
                });

                this.getView().setModel(oJson, "tableMaterial");

            } catch (err) {

                // 🔥 limpa a lista da tela
                this.getView().getModel("tableMaterial")?.setProperty("/Table", []);

                const sMensagem =
                    err?.error?.message ||
                    err?.cause?.error?.message ||
                    "Erro ao buscar qtd material";

                //sap.m.MessageBox.error(sMensagem);
                MessageToast.show(sMensagem);
            }
        },

    });
});
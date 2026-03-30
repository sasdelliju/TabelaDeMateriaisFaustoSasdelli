using materiais from '../db/schema';

service MateriaisService {

    entity Material as projection on materiais.Material;   

    function FiltroMateriais(qtd : Integer) returns array of Material;

    function ListaMateriais(ID : Integer) returns array of Material;

    action CriarMaterial(
        ID   : Integer,
        NumMat : Integer,
        Nome : String,
        Descr  : String
    ) returns Material;

}
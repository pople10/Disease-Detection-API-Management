const DB = require("../connectionDB");
var Statistic = function()
{
    this.data=
    {
        id:null,
        ip:null,
        symptoms:null,
        disease:null
        
    };
    this.fullfill = function(ip,symptoms,disease)
    {
        this.data.ip=ip;
        this.data.symptoms=symptoms;
        this.data.disease=disease;
    };
    this.getInfo = function()
    {
        return this.data;
    };
    this.insert = function()
    {
        DB.query('INSERT INTO public.statistics(ip,"SymptomsSeparatedByComma","Disease") VALUES($1,$2,$3)'
        ,[this.data.ip,this.data.symptoms,this.data.disease],function(err,result)
        {
            if(err)
               return err;
            
        });
    };
};

module.exports = new Statistic();
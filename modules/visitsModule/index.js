const DB = require("../connectionDB");
var Visit = function()
{
    this.data=
    {
        ip:null,
        city:null,
        region:null,
        country:null,
        loc:null,
        org:null
    };
    this.fullfill = function(info)
    {
        for(var prop in this.data)
        {
            if(this.data[prop]!==undefined)
                this.data[prop]=info[prop];
        }
    };
    this.getInfo = function()
    {
        return this.data;
    };
    this.insert = function()
    {
        var query = "INSERT INTO public.visits(ip,city,region,country,loc,org) VALUES($1,$2,$3,$4,$5,$6)";
        DB.query(query,[this.data.ip,this.data.city,this.data.region,this.data.country,this.data.loc,this.data.org],function(err,result)
        {
            return err;
        });
    };
};

module.exports = new Visit();
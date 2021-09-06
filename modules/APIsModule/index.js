const DB = require("../connectionDB");
class APIsModule
{
    constructor()
    {
        this.verbs = ["GET","POST","DELETE","PUT","HEAD"];
        this.URLValidator = function(str) {
          var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
          return !!pattern.test(str);
        };
    }
    async insert(URI,VERB,res)
    {
        var selected = "FALSE";
        if(!this.URLValidator(URI))
            return {message:"Invalid URI",done:false};
        if(!this.verbs.includes(VERB))
            return {message:"Invalid VERB",done:false};
        DB.connect();
        let query = "INSERT INTO public.apis_pfa(uri,verb,selected) VALUES($1,$2,$3)";
        await DB.query(query,[URI,VERB,selected],function(res,err)
        {
            if(err)
            {
                return {message:"Something went wrong",done:false};
            }
            return {message:"Added successfully",done:true};
        });
    }
}

module.exports = new APIsModule();
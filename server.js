const express = require("express");
const app = express();
var session = require('express-session');
const bodyParser = require("body-parser");
const DB = require("./modules/connectionDB");
const fetch = require("node-fetch");
const RequestIp = require('@supercharge/request-ip');
const cors = require('cors');
var visit = require("./modules/visitsModule");
var statistic = require("./modules/statisticModule");

DB.connect();

var verbs = ["GET","POST","DELETE","PUT","HEAD"];
var URLValidator = function(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
};
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(cors({origin: '*'}));

app.use(session({
  secret: 'pople10cronaboy100*$_fbd',
  resave: false,
  saveUninitialized: false
}));

app.get("/login", function(req,res)
{
    if(req.session.connected===true)
        return res.redirect("/");
    return res.render("login");
});

app.post("/login", function(req,res)
{
    if(req.session.connected===true)
        return res.redirect("/");
    if(req.body.username==="pople10" && req.body.password=="admin")
        req.session.connected=true;
    if(req.body.remember && req.body.remember==="on")
        req.session.cookie.maxAge = 100 * 60000;
    return res.redirect("/");
});

app.get("/logout", function(req,res)
{
    req.session.destroy(function(err){
         if(err){
            return res.redirect("/");
         }
         return res.redirect("/login");
    });
});

app.get("/", function(req,res)
{
    if(!req.session.connected)
        return res.redirect("/login");
    return res.render("select");
});

app.get("/addAPI", function(req,res)
{
    if(!req.session.connected)
        return res.redirect("/login");
    return res.render("select");
});

app.get("/change", function(req,res)
{
    if(!req.session.connected)
        return res.redirect("/login");
    return res.render("select");
});

app.get("/APIs/List", function(req,res)
{
    if(!req.session.connected)
        return res.redirect("/login");
    return res.render("select");
});

app.get("/statistic", function(req,res)
{
    if(!req.session.connected)
        return res.redirect("/login");
    return res.render("statistic");
});

app.get("/getURLs",function(req,res)
{
        let query = "SELECT * FROM public.apis_pfa WHERE selected=$1";
        DB.query(query,["TRUE"],function(err,result)
        {
            if(err)
            {
                res.status(490);
                return res.json("Something went wrong");
            }
            if(result.rows.length===0)
            {
                res.status(498);
                return res.json("No URI provided");
            }

            return res.json(result.rows[0].uri);
        });
    
});


app.get("/api/addVisitRecord",function(req,res)
{
        const ip_address = RequestIp.getClientIp(req);
        fetch("http://ipinfo.io/"+ip_address+"/json")
        .then(response => response.json())
        .then(data => 
        {
            visit.fullfill(data);
            visit.insert();
            return res.json("done");
        }).catch(e=>{return res.json(e);});
    
});

app.get("/api/addSymptomsRecord/:symp/:dis",function(req,res)
{
        let symp = req.params.symp;
        let dis = req.params.dis;
        const ip_address = RequestIp.getClientIp(req);
        statistic.fullfill(ip_address,symp,dis);
        statistic.insert();
        return res.json(statistic.getInfo());
});

app.get("/api/getSymptomsRecords",function(req,res)
{
        if(!req.session.connected)
        {
            res.status(415);
            return res.json("You are not connected!");
        }
        DB.query("SELECT s.*,v.* FROM public.statistics s INNER JOIN public.visits v ON v.ip = s.ip",function(err,result)
        {
            if(err)
                return res.json([]);
            res.json(result.rows);
        });
});

app.post("/api/API/add",function(req,res)
{
        if(!req.session.connected)
        {
            res.status(415);
            return res.json("You are not connected!");
        }
        var URI = req.body.uri;
        var VERB = req.body.verb;
        var selected = "FALSE";
        let query = "INSERT INTO public.apis_pfa(uri,verb,selected) VALUES($1,$2,$3)";
        if(!URLValidator(URI))
        {
            res.json({message:"Invalid URI",done:false});
            return res.end();
        }
        if(!verbs.includes(VERB))
        {
            res.json({message:"Invalid VERB",done:false});    
            return res.end();
        }
        DB.query(query,[URI,VERB,selected],function(err,result)
        {
            if(err)
            {
                res.json({message:"Something went wrong\n"+err,done:false});
            return res.end();
            }
            res.json({message:"Added successfully",done:true});
            return res.end();
        });
});

app.get("/api/API/getAll",function(req,res)
{
        if(!req.session.connected)
        {
            res.status(415);
            return res.json("You are not connected!");
        }
        let query = "SELECT * FROM public.apis_pfa";
        DB.query(query,function(err,result)
        {
            if(err)
            {
                res.status(403);
                return res.json();
            }
            return res.json(result.rows);
        });
});

app.put("/api/API/change",function(req,res)
{
        if(!req.session.connected)
        {
            res.status(415);
            return res.json("You are not connected!");
        }
        let uri = req.body.uri;
        if(!URLValidator(uri))
        {
            res.json({message:"Invalid URI",done:false});
            return res.end();
        }
        DB.query("UPDATE public.apis_pfa SET selected=$1 WHERE TRUE",['FALSE'],function(err,result)
        {
            if(err)
            {
                res.status(402);
                return res.json(err);
            }
            DB.query("UPDATE public.apis_pfa SET selected=$1 WHERE uri=$2",["TRUE",uri],function(err2,result2)
            {
                if(err)
                {
                    return res.json({message:err,done:false});
                }
                return res.json({message:"Added successfully",done:true});
            });
        });
});

app.get("/api/getDisease",function(req,res)
{
        var symp = req.query.Symptom;
        if(symp==null)
            return res.send("No symptoms has been sent");
        let query = "SELECT * FROM public.apis_pfa WHERE selected=$1";
        DB.query(query,["TRUE"],function(err,result)
        {
            if(err)
            {
                res.status(490);
                return res.json("Something went wrong");
            }
            if(result.rows.length===0)
            {
                res.status(498);
                return res.json("No URI provided");
            }
            const data = result.rows[0];
            fetch('https://google.com',{headersheaders:req.headers}) 
            .then(resFromFetch => resFromFetch.text()) 
            .then(body => {return res.send(body);});
            if(data.verb==="GET")
            {
                //return res.send(req.get({url:data.uri+"?Symptom="+symp}));
            }
            if(data.verb==="POST")
            {
                return res.json("POST : "+data.uri);
            }
            if(data.verb==="PUT")
            {
                return res.json("PUT : "+data.uri);
            }
            if(data.verb==="DELETE")
            {
                return res.json("DELETE : "+data.uri);
            }
            if(data.verb==="HEAD")
            {
                return res.json("HEAD : "+data.uri);
            }
            return res.json("Another : "+data.uri);
        });
});

app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
});

app.use(function(err, req, res, next) {
      // Set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // Render the error page
      res.status(err.status || 500);
      res.render('404');
});

app.listen();
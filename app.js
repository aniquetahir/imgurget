/**
 * Created by AniqueTahir on 7/17/2015.
 */
var http=require('http');
var _ = require('underscore');
var fs = require('fs');

var combinations_parsed = [];
var successful_combinations = [];

try {
    var strParsed = fs.readFileSync("parsed.json", {encoding: "utf8"});
    var strPassed = fs.readFileSync("passed.json", {encoding: "utf8"});
}catch(e){
    console.log(e);
}
console.log(strParsed);

try {
    combinations_parsed = JSON.parse(strParsed);
    successful_combinations = JSON.parse(strPassed);
}catch(e){}

var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//var charsetCounters = [0,0,0,0,0,0,0];



var checkImgur = function(key,cb){
    var options = {
        hostname: "imgur.com",
        method: 'GET',
        path: '/'+key
    };


    var req = http.request(options, function(res){
        //console.log("Status:"+res.statusCode);
        if(res.statusCode==200){
            successful_combinations.push(key);
            console.log(res.statusCode);
            fs.writeFileSync("passed.json", JSON.stringify(successful_combinations));
        }else{
            console.log(res.statusCode);
        }

        combinations_parsed.push(key);
        fs.writeFileSync("parsed.json", JSON.stringify(combinations_parsed));

        cb();

        res.on('data',function(){});

        res.on('end',function(){
        });


    });

    req.on('error',function(err){
        console.log(err.message);
    });

    req.end();
};

var parseKey = function(){
    var key = "";
    for(var alphabet = 0;alphabet<7;alphabet++){
        var alphaBit = Math.random()*62;
        //charsetCounters[alphabet] = Math.random()*62;
        key += charset.charAt(alphaBit);
    }

    console.log(key);
    if(_.indexOf(combinations_parsed,key)==-1){
        checkImgur(key,parseKey);
    }else{
        parseKey();
    }
};

parseKey();

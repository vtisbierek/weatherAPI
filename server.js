require('dotenv').config();
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");   
    console.log(process.env.APP_KEY); 
})

app.post("/",function(req,res){
    var cityName = req.body.cityName;
    var geoCodingUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + process.env.APP_KEY;

    console.log(process.env.APP_KEY);

    https.get(geoCodingUrl, function(response){
        response.on("data", function(data){
            var geoCode = JSON.parse(data); //parse é o contrário de stringify, parse pega uma linha e transforma em objeto, stringify pega um objeto e transforma em linha

            var latitudeCode = geoCode[0].lat; //é preciso acessar a primeira posição do array geoCode pq essa merda de API de GeoCoding envia o objeto como se fosse um array de 1 posição...
            var longitudeCode = geoCode[0].lon;

            var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitudeCode + "&lon=" + longitudeCode + "&units=metric&appid=" + process.env.APP_KEY;

            https.get(weatherUrl, function(resp){
                resp.on("data", function(data){
                    var weatherData = JSON.parse(data); //já a API de current weather não faz isso, manda o objeto como um único elemento mesmo, então aqui eu poderia acessar simplesmente digitando weatherCondition.something, por exemplo
                   
                    var currentTemp = weatherData.main.temp;
                    var feelsLikeTemp = weatherData.main.feels_like;
                    var weatherCondition = weatherData.weather[0].description;
                    var weatherIcon = weatherData.weather[0].icon;
                    var imageUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

                    //res.send("<h1>The temperature in Porto Alegre right now is " + currentTemp + "°C, and the weather is " + weatherCondition + " <img src='http://openweathermap.org/img/w/" + weatherIcon + ".png'>.</h1><br><h2>The thermal sensation is " + feelsLikeTemp + "°C.</h2>");
                    res.write("<body style='background-color:black;color:white;'></body>")
                    res.write("<h1>The temperature in " + cityName + " right now is " + currentTemp + " degrees Celsius.</h1>");
                    res.write("<h2>The weather is <img src=" + imageUrl + "> (" + weatherCondition + ").</h2>");
                    res.write("<h3>The thermal sensation is " + feelsLikeTemp + " degrees Celsius.</h3>");
                    res.write("<p>VTISBIEREK 2023</p>")
                    res.send();
                })
            })
        })
    });
})

app.listen(3000,function(){
    console.log("Servidor rodando na porta 3000.");
})
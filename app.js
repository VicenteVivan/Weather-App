const express = require("express");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/cities/:anyCity", (req, res) => {
    const city = _.lowerCase(req.params.anyCity);
    const apiKey = "3dde7e297a956a3247cd001ee414d4cd";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    https.get(url, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            if (weatherData.cod == 200) {
                res.render("city", {
                    formatedCityName: _.startCase(_.toLower(city)),
                    cityName: city,
                    temp: weatherData.main.temp,
                    main: weatherData.weather[0].main,
                    description: weatherData.weather[0].description,
                });
            } else {
                console.log("Ouch");
            }
        });
    });
});

app.post("/", (req, res) => {
    console.log(req.body);
    const cityName = req.body.inputCity;
    res.redirect("/cities/" + _.kebabCase(cityName));
});

app.listen(3000, () => {
    console.log("The server is running on port 3000");
});

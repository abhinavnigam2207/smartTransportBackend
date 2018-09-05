const express  = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const axios = require('axios');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./smart-transport.db');
 
db.serialize(function() { 
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});
 
// db.close();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

let url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=";
const secondParamter = "&types=geocode&location=28.644800,77.216721&radius=500&key=AIzaSyDt8WyuEo6kL0vPTPSa88bAWk7l_pMKOlY"

// creating server
app.listen("7777", function(){
    console.log("server started at port", 7777)
})

app.post('/', function(req, res){
    const query = req.body.query;
    axios.get(`${url}${query}${secondParamter}`)
    .then(result => {
        console.log(result)
        var predictions = result.data.predictions.map(item => {
            return(item.description)
        });
        console.log(predictions)
        res.json({data:predictions})
    }).catch(e => console.log("Error:", e))
    
})

app.get('/stopDetails', function(req, res){
    db.all("SELECT * FROM table_stopdetails", function(err, rows){
        console.log(rows);
        res.json(rows);
    });
});

app.get('/allRoutes', function(req, res){
    db.all("SELECT * FROM table_bus", function(err, rows){
        console.log(rows);
        res.json(rows);
    });
});

app.get('/sublocations', function(req, res){
    db.all("SELECT * FROM table_sublocation", function(err, rows){
        console.log(rows);
        res.json(rows);
    });
});

// app.get('/routes/', function(req, res){
//     const query = req.body.query;
//     axios.get(`routes/${query}`)
//     .then(result => {
//         res.json({data:predictions})
//     }).catch(e => console.log("Error:", e))
//     debugger;
//     console.log('hello');
//     db.all("SELECT Bus Number FROM table_bus where Stop =" + query , function(err, rows){
//         console.log(rows);
//         res.json(rows);
//     });
// });

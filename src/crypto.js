'use strict';

var request = require('request');
const args = require('yargs').argv;
const date = require('date-and-time');

var cryptoCompare;
var usdValues;

// Function to get the latest portfolio value per token in USD
var getLatestValuePerTokenInUSD = function() {
    return new Promise(function (resolved) {

        var output = []; // Array to store the output

    
        var btcOutputArr = { "token": "BTC", "amount": 0, "timestamp": 0 };
        var ethOutputArr = { "token": "ETH", "amount": 0, "timestamp": 0 };
        var ltcOutputArr = { "token": "LTC", "amount": 0, "timestamp": 0 };

        
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('transactions.csv')
        });

        lineReader.on('line', function (line) {

            var jsonFromLine = {};
            var lineArraySplit = line.split(',');

            jsonFromLine.timestamp = lineArraySplit[0];
            jsonFromLine.transaction_type = lineArraySplit[1];
            jsonFromLine.token = lineArraySplit[2];
            jsonFromLine.amount = lineArraySplit[3];

            if (jsonFromLine.token === 'ETH') {
                if (jsonFromLine.timestamp > ethOutputArr.timestamp) {
                    ethOutputArr.amount = jsonFromLine.amount;
                    ethOutputArr.timestamp = jsonFromLine.timestamp;
                }
            }
            else if (jsonFromLine.token === 'BTC') {
                if (jsonFromLine.timestamp > btcOutputArr.timestamp) {
                    btcOutputArr.amount = jsonFromLine.amount;
                    btcOutputArr.timestamp = jsonFromLine.timestamp;
                }
            }
            else if (jsonFromLine.token === 'LTC') {
                if (jsonFromLine.timestamp > ltcOutputArr.timestamp) {
                    ltcOutputArr.amount = jsonFromLine.amount;
                    ltcOutputArr.timestamp = jsonFromLine.timestamp;
                }
            }
        }
        );
        lineReader.on('close', function (line) {
            cryptoCompare = getUSDValues(); // Get the USD values from CryptoCompare // TODO: Move this to a separate function

            cryptoCompare.then(function (result) {
                usdValues = result; // Save the result in a variable
                ethOutputArr.amount = ethOutputArr.amount * usdValues.ETH.USD;
                btcOutputArr.amount = btcOutputArr.amount * usdValues.ETH.USD;
                ltcOutputArr.amount = ltcOutputArr.amount * usdValues.ETH.USD;

                output.push(btcOutputArr);
                output.push(ethOutputArr);
                output.push(ltcOutputArr);
                resolved(output);
            }, function (error) {
                console.log(error);
            })
        })
    });
}

// Function to get the portfolio value per token in USD
var getPortfolioValuePerToken = function() {
    console.log("cryptoLatest-->getPortfolioValuePerToken");
    console.log("Date", args.date);
    return new Promise(function (resolved) {

        var output = [];

        var btcOutputArr = [];
        var ethOutputArr = [];
        var ltcOutputArr = [];

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('transactions.csv')
        });

        lineReader.on('line', function (line) {

            var jsonFromLine = {};
            var lineArraySplit = line.split(',');

            jsonFromLine.timestamp = lineArraySplit[0];
            jsonFromLine.transaction_type = lineArraySplit[1];
            jsonFromLine.token = lineArraySplit[2];
            jsonFromLine.amount = lineArraySplit[3];

            // converting date from timestamp
            var date = new Date(jsonFromLine.timestamp * 1000);
            var dateFromCsvFile = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

            if (jsonFromLine.token === 'ETH') {
                if (args.date === dateFromCsvFile) {
                    ethOutputArr.push({"token": jsonFromLine.token, "amount": jsonFromLine.amount * usdValues.ETH.USD});
                }
            } else if (jsonFromLine.token === 'BTC') {
                if (args.date === dateFromCsvFile) {
                    btcOutputArr.push({"token": jsonFromLine.token, "amount": jsonFromLine.amount * usdValues.ETH.USD});
                }
            } else if (jsonFromLine.token === 'LTC') {
                if (args.date === dateFromCsvFile) {
                    ltcOutputArr.push({"token": jsonFromLine.token, "amount": jsonFromLine.amount * usdValues.ETH.USD});
                }
            }
        });
        lineReader.on('close', function (line) {
            output.push(btcOutputArr);
            output.push(ethOutputArr);
            output.push(ltcOutputArr);
            resolved(output);
        });
    });
}

// Function to fetch the USD Values from CryptoCompare
function getUSDValues() {

    var cryptoURL = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=3789ea397be622354552b3ab2a826e4379b5da952de997d3cff964ed4f0786ee';

    var options = {
        url: cryptoURL,
        headers: {
            'User-Agent': 'request'
        }
    };
    // Return new promise 
    return new Promise(function (resolve, reject) {
        // Do async job
        request.get(options, function (err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}

function filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof(obj[key] == "object")){
                var item = obj[key];
                if(item[prop] == value){
                    filtered.push(item);
                }
            }
        }

    }    
    return filtered;

}

// Based on the type of the parameters we pass as cmd, corresponding function will be called
if(args.token === undefined && args.date === undefined){
    console.log("Given no parameters, return the latest portfolio value per token in USD");
    getLatestValuePerTokenInUSD().then(function (result) { console.log(result); });
}
else if (args.token != undefined && args.date === undefined){
    console.log("Given a token, return the latest portfolio value for that token in USD");
    getLatestValuePerTokenInUSD().then(function (result) { 
        var resultPerToken =  result.filter(function(record) {
            return record.token === args.token;
            })
            console.log(resultPerToken);
     });
}
else if (args.date != undefined && args.token === undefined){
    console.log("Given a date, return the portfolio value per token in USD on that date");
    cryptoCompare = getUSDValues();
    cryptoCompare.then(function (result) {
     usdValues = result;
     getPortfolioValuePerToken().then(function (result) { console.log(result); });
 }, function (err) {
     console.log(err);
 })
    
}
else if (args.token != undefined && args.date != undefined){
    console.log("Given a date and a token, return the portfolio value of that token in USD on that date");
    cryptoCompare = getUSDValues();
    cryptoCompare.then(function (usdVal) {
    usdValues = usdVal;
    getPortfolioValuePerToken().then(function (result) { 
         
        var resultPerToken =  filterByProperty(result,"token",args.token);
            console.log(resultPerToken); 
        });
 }, function (err) {
     console.log(err);
 })
}
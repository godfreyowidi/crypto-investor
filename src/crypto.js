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
                btcOutputArr.amount = btcOutputArr.amount * usdValues.BTC.USD;
                ltcOutputArr.amount = ltcOutputArr.amount * usdValues.LTC.USD;

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
                    btcOutputArr.push({"token": jsonFromLine.token, "amount": jsonFromLine.amount * usdValues.BTC.USD});
                }
            } else if (jsonFromLine.token === 'LTC') {
                if (args.date === dateFromCsvFile) {
                    ltcOutputArr.push({"token": jsonFromLine.token, "amount": jsonFromLine.amount * usdValues.LTC.USD});
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
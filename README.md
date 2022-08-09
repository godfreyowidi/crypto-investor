## **Crypto Investor**

This is a command line application that having made transactions over a period of time and logged in a CSV file;

    1. Given no parameters, return the latest portfolio value per token in USD
    2. Given a token, return the latest portfolio value for that token in USD
    3. Given a date, return the portfolio value per token in USD on that date
    4. Given a date and a token, return the portfolio value of that token in USD on that date

By Godfrey Owidi

### _Technologies used_

    - NodeJS
    - Jest
    - CryptoCompare
    - Babel

### _Setup/Installation_

Navigate to [https://github.com/godfreyowidi/propine-crypto-investor](https://github.com/godfreyowidi/propine-crypto-investor)

To clone and run this application you will need to have Git installed on your system

Then clone this repository Repository to your computer using the following commands in your terminal:

    - Clone repository to your computer:
      `$ git clone <repo>`
    - Install all dependencies in packages.
      `$ npm install`
    - build/prep tasks for project
      `$ npm run build`
    - To specify test suite for the tests scripts
      `$ npm run test`

### _Usage_

Given a date and a token, return the portfolio value of that token in USD on that date

`node ./src/crypto.js --date=4/3/2018 --token=BTC`

![ return portfolio of a token in USD ](/assets/first.png)

Given a date, return the portfolio value per token in USD on that date

`node ./src/crypto.js --date=4/3/2018`

![ return portfolio of a token in USD ](/assets/second.png)

Given a token, return the latest portfolio value for that token in USD

`node ./src/crypto.js --token=BTC`

![ return portfolio of a token in USD ](/assets/third.png)

Given no parameters, return the latest portfolio value per token in USD

`node ./src/crypro.js`

![ return portfolio of a token in USD ](/assets/fourth.png)

### _Design Decisions_

Used Jest because it is faster than Mocha. It has built-in support for snapshot testing, which means tests are run automatically on each change to the code. This makes it easy to keep your tests up to date as you work.

Chose Babel to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript - especially with the `import` statements

Instead of the file path being a flag (--file=path/to/transactions.csv), I designed the program to require it as an argument instead. Mainly because the file is always required in order for the code to run, unlike token and timestamp which are both optional.

I've decided to design the program to accept any CSV files provided they have the required columns, and not lock the program to use only the provided CSV. Additionaly, I've also decided to not commit the transactions.csv file because of the file size (even when zipped). It is never a good coding practice to commit and push large files in the code repository.

Crypto exchange rates are fetched only once by a single call with multiple symbols, the program will get all unique symbols in the CSV file. If a token symbol is invalid anywhere in the CSV, the program will simply ignore the faulty token symbol, and will just proceed on the valid ones.

### _License_

Copyright 2022 Godfrey Owidi

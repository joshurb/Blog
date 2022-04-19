const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());



const drinks = {

    1: {'name': 'Monster Ultra Sunrise', "caffeineAmountMG": 75, "servings": 2},
    2: {'name': 'Black Coffee', "caffeineAmountMG": 95, "servings": 1},
    3: {'name': 'Americano', "caffeineAmountMG": 77, "servings": 1},
    4: {'name': 'Sugar free NOS', "caffeineAmountMG": 130, "servings": 2},
    5: {'name': '5 Hour Energy', "caffeineAmountMG": 200, "servings": 1},
};

const consumedDrinks = {};
let consumedDrinksID = 1;
const caffeineLimit = 500;
let currentCaffeineTotal = 0;



//returns all available drinks
app.get('/drinks', (req, res) => {
    res.send(drinks);
});

//returns all consumed drinks
app.get('/consumed_drinks', (req, res) => {
    res.send(consumedDrinks);
});

//adds a drink to the consumed drinks list if it does not put you over the daily limit
app.post('/consume', (req, res) => {
    console.log(drinks[req.body.drinkID])
    if(req.body.drinkID) {
        const drinkToDrink = drinks[req.body.drinkID];

        //console.log("the caffeine total for this drink is:" + drinkToDrink.caffeineAmountMG * drinkToDrink.servings);
        //consumedDrinks[consumedDrinksID] = {"consumedDrinkId" : req.body.drinkID};
        //consumedDrinks[consumedDrinksID] = {"consumedDrink" : drinkToDrink};
        if(consumedDrinks[req.body.drinkID]) {
            const curDrink = consumedDrinks[req.body.drinkID];
            consumedDrinks[req.body.drinkID] = {"drink": drinks[req.body.drinkID], "runningTotal": curDrink.runningTotal + drinkToDrink.caffeineAmountMG * drinkToDrink.servings};
        }
        else{
            consumedDrinks[req.body.drinkID] = {"drink": drinks[req.body.drinkID], "runningTotal": drinkToDrink.caffeineAmountMG * drinkToDrink.servings};
            //const payload={"drink": drinks[req.body.drinkID], "runningTotal": drinkToDrink.caffeineAmountMG * drinkToDrink.servings}
            //consumedDrinks.push({req.body.drinkID: payload});
        }

        consumedDrinksID++;

        res.status(201).send(consumedDrinks);
    }
    else {
        //no drink id was provided
        res.status(404).send({error: "No drink id provided"});
    }


});

function getCafTotal(drinkList)
{console.log(drinkList)
    let total=0;
    for (const drink in drinkList){
        console.log(drink)
        total=total+drink.runningTotal;
    }
    return total;

}

//resets all data to empty
app.delete('/reset', (req, res) => {
    consumedDrinks = {};
    consumedDrinksID = 1;
    currentCaffeineTotal = 0;
    res.send(consumedDrinks);
});

//helper function to check if it is safe to consume a drink
function safeToConsume(drinkID) {
    const drink = drinks[drinkID];
    //todo make sure the drink wont put you over the daily limit
}

app.listen(4000, () => {
    console.log('Listening on port 4000');
});

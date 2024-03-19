const readline = require('readline');

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout 
});

let cards = {};

let hand = [];

let currDHand = 0;

const dealerHand = () => new Promise((res, rej) => rl.question("Input dealer's first card...\n", async num => {
    isNaN(+num) ? await dealerHand() : res(+num);
    currDHand = +num;
}));

const handSum = () => {
    let result = 0;
    for(let i = 0; i < hand.length; i++){
        result += hand[i];
    }
    return result;
}

const calcProbability = () => {
    let deckSum = 1;
    let hSum = handSum();
    let bustTotal = 0;
    let standTotal = 0;
    let hitTotal = 0;
    for(const card in cards){
        deckSum += cards[card];

        bustTotal += +card + hSum > 21 ? cards[card] : 0;

        standTotal += +card + currDHand < hSum ? cards[card] : 0;

        hitTotal += +card + hSum <= 21 ? cards[card]: 0;
    }

    deckSum -= 1;
    //Something might be wrong here I'm unsure...

    console.log(
        `----------------------------------------------------------\n`,
        `\n`,
        `Hit Rate: approx. ${((hitTotal - 1)/deckSum) * 100}%\n`,
        `Stand Rate: approx. ${(standTotal/deckSum) * 100}%\n`,
        `Bust Rate: approx. ${((bustTotal - 1)/deckSum) * 100 < 0 ? 0 : ((bustTotal - 1)/deckSum) * 100}%\n`,
        `\n`,
        `----------------------------------------------------------\n`
    );
    

}

const userHand = () => new Promise((res, rej) => rl.question("Enter your next card...\n", async num => {
    cards[+num] ? false : await userHand();
    hand.push(+num);
    cards[+num] -= 1;
    calcProbability();
    await addCard();
}));

const addCard = () => new Promise((res, rej) => rl.question("Additional Cards? (y/n)\n", async response => {
    switch(response){
        case "y":
            hand.push(await userHand());
        break;
        case "n":
            main();
        break;
        default:
            await addCard();
        break;
    }
    res();
}));



const main = async () => {

    hand = [];

    cards = {
        1: 4,
        2: 4,
        3: 4,
        4: 4,
        5: 4,
        6: 4,
        7: 4,
        8: 4,
        9: 4,
        10: 16,
    };

    await dealerHand();

    cards[currDHand] -= 1;

    await userHand();

}

main();

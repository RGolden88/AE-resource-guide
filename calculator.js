/* ============================================
   Atlas Earth Calculator
   Cleaned Calculator JS
============================================ */

const calculateRent = document.getElementById("calculateRent");
const calculateDiamonds = document.getElementById("calculateDiamonds");
const calculateGoal = document.getElementById("calculateGoal");


/* ============================================
   Boost Tier
============================================ */

function getBoostMultiplier(totalParcels) {

    if (totalParcels <= 150) return 30;
    if (totalParcels <= 220) return 20;
    if (totalParcels <= 290) return 15;
    if (totalParcels <= 365) return 12;
    if (totalParcels <= 435) return 10;
    if (totalParcels <= 545) return 8;
    if (totalParcels <= 625) return 7;
    if (totalParcels <= 730) return 6;
    if (totalParcels <= 875) return 5;
    if (totalParcels <= 1100) return 4;
    if (totalParcels <= 1500) return 3;

    return 2;
}


/* ============================================
   Badge Bonus
============================================ */

function getBadgeBonus(badges) {

    if (badges >= 101) return 1.25;
    if (badges >= 61) return 1.20;
    if (badges >= 31) return 1.15;
    if (badges >= 11) return 1.10;
    if (badges >= 1) return 1.05;

    return 1;
}


/* ============================================
   Suggestion
============================================ */

function getBuySuggestion(totalParcels, badges) {

    if (totalParcels < 40) {
        return "Buy parcels first.";
    }

    if (badges === 0) {
        return "Consider buying your first badge.";
    }

    if (totalParcels >= 150 && badges < 11) {
        return "Badges may increase your earnings.";
    }

    if (badges >= 11) {
        return "Parcels may be better until next badge tier.";
    }

    return "Keep building your land.";
}



/* ============================================
   Parcel Earnings
============================================ */

function calculateParcelIncome(
    common,
    rare,
    epic,
    legendary,
    lpu
){

    let remainingLPU = lpu;


    // LPUs upgrade common first
    let upgradedCommon = Math.min(
        remainingLPU,
        common
    );

    remainingLPU -= upgradedCommon;


    let upgradedRare = Math.min(
        remainingLPU,
        rare
    );

    remainingLPU -= upgradedRare;


    let upgradedEpic = Math.min(
        remainingLPU,
        epic
    );


    let normalCommon = common - upgradedCommon;
    let normalRare = rare - upgradedRare;
    let normalEpic = epic - upgradedEpic;


    let legendaryParcels =
        legendary +
        upgradedCommon +
        upgradedRare +
        upgradedEpic;


    const commonRent =
        normalCommon * 0.0000000011;

    const rareRent =
        normalRare * 0.0000000016;

    const epicRent =
        normalEpic * 0.0000000022;

    const legendaryRent =
        legendaryParcels * 0.0000000044;


    return (
        commonRent +
        rareRent +
        epicRent +
        legendaryRent
    );
}



/* ============================================
   Monthly Earnings Calculator
============================================ */

function calculateMonthlyRent(data){


    let rentPerSecond =
        calculateParcelIncome(
            data.common,
            data.rare,
            data.epic,
            data.legendary,
            data.lpu
        );


    rentPerSecond *= getBadgeBonus(data.badges);


    const secondsMonth =
        60 * 60 * 24 * 30;


    const srbSeconds =
        data.srbHours * 60 * 60;


    const regularSeconds =
        secondsMonth - srbSeconds;


    const boost =
        getBoostMultiplier(
            data.total
        );


    const boostedFraction =
        data.boostHours / 24;


    const normalFraction =
        1 - boostedFraction;


    const regularRent =
        rentPerSecond *
        regularSeconds *
        (
            boostedFraction * boost +
            normalFraction
        );


    const srbRent =
        rentPerSecond *
        srbSeconds *
        50;


    return regularRent + srbRent;

}



/* ============================================
   Main Calculator Button
============================================ */

calculateRent.addEventListener(
"click",
function(){


const common =
Number(document.getElementById("commonParcels").value);

const rare =
Number(document.getElementById("rareParcels").value);

const epic =
Number(document.getElementById("epicParcels").value);

const legendary =
Number(document.getElementById("legendaryParcels").value);

const lpu =
Number(document.getElementById("lpuCount").value);

const badges =
Number(document.getElementById("badgesOwned").value);

const boostHours =
Number(document.getElementById("boostHours").value);

const srbHours =
Number(document.getElementById("srbHours").value);


const total =
common +
rare +
epic +
legendary;



/* Percentages */

if(total > 0){

document.getElementById("commonPercent").textContent =
((common / total)*100).toFixed(1)+"%";


document.getElementById("rarePercent").textContent =
((rare / total)*100).toFixed(1)+"%";


document.getElementById("epicPercent").textContent =
((epic / total)*100).toFixed(1)+"%";


document.getElementById("legendaryPercent").textContent =
((legendary / total)*100).toFixed(1)+"%";

}
else{

document.getElementById("commonPercent").textContent="0%";
document.getElementById("rarePercent").textContent="0%";
document.getElementById("epicPercent").textContent="0%";
document.getElementById("legendaryPercent").textContent="0%";

}



const monthly =
calculateMonthlyRent({

common,
rare,
epic,
legendary,
lpu,
badges,
boostHours,
srbHours,
total

});


const daily =
monthly / 30;

const weekly =
daily * 7;

const yearly =
monthly * 12;



document.getElementById("totalParcels").textContent =
total;


document.getElementById("boostTier").textContent =
getBoostMultiplier(total)+"x";


document.getElementById("dailyRent").textContent =
daily.toFixed(2);


document.getElementById("weeklyRent").textContent =
weekly.toFixed(2);


document.getElementById("monthlyRent").textContent =
monthly.toFixed(2);


document.getElementById("yearlyRent").textContent =
yearly.toFixed(2);


document.getElementById("buySuggestion").textContent =
getBuySuggestion(total,badges);



document.getElementById("portfolioValue").textContent =
(total * (100/24)).toFixed(2);


});

/* ============================================
   SRB Calculator
============================================ */

const srbDropdown =
document.getElementById("srbHoursOnly");


if (srbDropdown) {

    for(let i = 1; i <= 64; i++){

        let option =
        document.createElement("option");

        option.value = i;

        option.textContent =
        i + (i === 1 ? " Hour" : " Hours");

        srbDropdown.appendChild(option);

    }

}



/*
   Calculate hourly SRB earnings
*/

function calculateHourlySRB(){

    const common =
    Number(document.getElementById("commonParcels").value);

    const rare =
    Number(document.getElementById("rareParcels").value);

    const epic =
    Number(document.getElementById("epicParcels").value);

    const legendary =
    Number(document.getElementById("legendaryParcels").value);

    const lpu =
    Number(document.getElementById("lpuCount").value);

    const badges =
    Number(document.getElementById("badgesOwned").value);


    const income =
    calculateParcelIncome(
        common,
        rare,
        epic,
        legendary,
        lpu
    );


    return (
        income *
        getBadgeBonus(badges) *
        60 *
        60 *
        50
    );

}



const calculateSRBOnly =
document.getElementById("calculateSRBOnly");


if(calculateSRBOnly){

calculateSRBOnly.addEventListener(
"click",
function(){


const hours =
Number(
document.getElementById("srbHoursOnly").value
);


const hourly =
calculateHourlySRB();


const total =
hourly * hours;



document.getElementById("displaySRBHours")
.textContent =
hours;



document.getElementById("srbPerHour")
.textContent =
hourly.toFixed(4);



document.getElementById("srbOnlyResult")
.textContent =
total.toFixed(4);



});


}



/* ============================================
   Diamond Calculator
============================================ */


if(calculateDiamonds){

calculateDiamonds.addEventListener(
"click",
function(){


const diamonds =
Number(
document.getElementById("diamondsOwned").value
);


const spins =
Number(
document.getElementById("spinsPerDay").value
);



if(spins <= 0){

document.getElementById("diamondDays")
.textContent =
"0";

return;

}



const days =
diamonds / spins;



document.getElementById("diamondDays")
.textContent =
days.toFixed(1);



});


}



/* ============================================
   Goal Calculator
============================================ */

function estimateDailyRentWithParcels(
    parcels,
    badges,
    boostHours,
    srbHours
){

    let averageRent =
        parcels * 0.00000000158;

    averageRent *=
        getBadgeBonus(badges);

    const monthSeconds =
        60 * 60 * 24 * 30;

    const srbSeconds =
        srbHours * 60 * 60;

    const regularSeconds =
        monthSeconds - srbSeconds;

    const boost =
        getBoostMultiplier(parcels);

    const boosted =
        boostHours / 24;

    const unboosted =
        1 - boosted;

    const regular =
        averageRent *
        regularSeconds *
        (
            (boosted * boost) +
            unboosted
        );

    const srb =
        averageRent *
        srbSeconds *
        50;

    return (regular + srb) / 30;

}



if(calculateGoal){

calculateGoal.addEventListener(
"click",
function(){

    const common =
    Number(document.getElementById("commonParcels").value);

    const rare =
    Number(document.getElementById("rareParcels").value);

    const epic =
    Number(document.getElementById("epicParcels").value);

    const legendary =
    Number(document.getElementById("legendaryParcels").value);

    const badges =
    Number(document.getElementById("badgesOwned").value);

    const boostHours =
    Number(document.getElementById("boostHours").value);

    const srbHours =
    Number(document.getElementById("srbHours").value);

    const goal =
    Number(document.getElementById("dailyGoal").value);

    const goalType =
    document.getElementById("goalType").value;

    let dailyGoal;

    switch(goalType){

        case "hour":
            dailyGoal = goal * 24;
            break;

        case "day":
            dailyGoal = goal;
            break;

        case "week":
            dailyGoal = goal / 7;
            break;

        case "month":
            dailyGoal = goal / 30.4375;
            break;

        case "year":
            dailyGoal = goal / 365;
            break;

        default:
            dailyGoal = goal;

    }

    let current =
        common +
        rare +
        epic +
        legendary;

    let needed =
        current;

    while(
        estimateDailyRentWithParcels(
            needed,
            badges,
            boostHours,
            srbHours
        ) < dailyGoal
    ){

        needed++;

        if(needed > 10000){
            break;
        }

    }

    document.getElementById("goalAmount").textContent =
        goal.toFixed(2);

    document.getElementById("dailyEquivalent").textContent =
        dailyGoal.toFixed(2);

    const labels = {
        hour: "per hour",
        day: "per day",
        week: "per week",
        month: "per month",
        year: "per year"
    };

    document.getElementById("goalLabel").textContent =
        labels[goalType];

    document.getElementById("goalParcelsNeeded").textContent =
        needed;

    document.getElementById("additionalParcelsNeeded").textContent =
        Math.max(0, needed - current);

});
}


/* ============================================
   Auto Reset Invalid Numbers
============================================ */


document.querySelectorAll(
"input[type='number']"
)
.forEach(function(input){


input.addEventListener(
"change",
function(){


if(this.value < 0){

this.value = 0;

}


});


});

/* ============================================
   Atlas Earth Calculator JS
   Rebuilt for calculator.html
============================================ */


/* ============================================
   Element References
============================================ */

const calculateRent = document.getElementById("calculateRent");
const calculateSRBOnly = document.getElementById("calculateSRBOnly");
const calculateGoal = document.getElementById("calculateGoal");
const calculateDiamonds = document.getElementById("calculateDiamonds");



/* ============================================
   Boost Tier
============================================ */

function getBoostMultiplier(totalParcels){

    if(totalParcels <= 150) return 30;
    if(totalParcels <= 220) return 20;
    if(totalParcels <= 290) return 15;
    if(totalParcels <= 365) return 12;
    if(totalParcels <= 435) return 10;
    if(totalParcels <= 545) return 8;
    if(totalParcels <= 625) return 7;
    if(totalParcels <= 730) return 6;
    if(totalParcels <= 875) return 5;
    if(totalParcels <= 1100) return 4;
    if(totalParcels <= 1500) return 3;

    return 2;
}



/* ============================================
   Badge Bonus
============================================ */

function getBadgeBonus(badges){

    if(badges >= 101) return 1.25;
    if(badges >= 61) return 1.20;
    if(badges >= 31) return 1.15;
    if(badges >= 11) return 1.10;
    if(badges >= 1) return 1.05;

    return 1;
}



/* ============================================
   Buy Suggestion
============================================ */

function getBuySuggestion(total,badges){

    if(total < 40)
        return "Buy parcels first.";

    if(badges === 0)
        return "Consider buying your first badge.";

    if(total >= 150 && badges < 11)
        return "Badges may increase earnings.";

    if(badges >= 11)
        return "Parcels may be better until next badge tier.";

    return "Keep building your land.";
}



/* ============================================
   Parcel Income With LPU
============================================ */

function calculateParcelIncome(
    common,
    rare,
    epic,
    legendary,
    lpu
){

    let remaining = lpu;


    let upgradeCommon =
        Math.min(remaining, common);

    remaining -= upgradeCommon;


    let upgradeRare =
        Math.min(remaining, rare);

    remaining -= upgradeRare;


    let upgradeEpic =
        Math.min(remaining, epic);



    let normalCommon =
        common - upgradeCommon;

    let normalRare =
        rare - upgradeRare;

    let normalEpic =
        epic - upgradeEpic;



    let legendaryTotal =
        legendary +
        upgradeCommon +
        upgradeRare +
        upgradeEpic;



    let rent =

        (normalCommon * 0.0000000011) +

        (normalRare * 0.0000000016) +

        (normalEpic * 0.0000000022) +

        (legendaryTotal * 0.0000000044);


    return rent;

}



/* ============================================
   Monthly Calculator
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


    rentPerSecond *=
        getBadgeBonus(data.badges);



    const monthSeconds =
        60 * 60 * 24 * 30;


    const srbSeconds =
        data.srbHours * 3600;


    const regularSeconds =
        monthSeconds - srbSeconds;



    const boost =
        getBoostMultiplier(data.total);



    const boosted =
        data.boostHours / 24;


    const unboosted =
        1 - boosted;



    const regularRent =

        rentPerSecond *

        regularSeconds *

        (
            (boosted * boost) +
            unboosted
        );



    const srbRent =

        rentPerSecond *

        srbSeconds *

        50;



    return regularRent + srbRent;

}



/* ============================================
   Main Rent Calculator
============================================ */


if(calculateRent){

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
common + rare + epic + legendary;



/* Parcel Percentages */

document.getElementById("commonPercent").textContent =
total ? ((common/total)*100).toFixed(1)+"%" : "0%";


document.getElementById("rarePercent").textContent =
total ? ((rare/total)*100).toFixed(1)+"%" : "0%";


document.getElementById("epicPercent").textContent =
total ? ((epic/total)*100).toFixed(1)+"%" : "0%";


document.getElementById("legendaryPercent").textContent =
total ? ((legendary/total)*100).toFixed(1)+"%" : "0%";



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

}

/* ============================================
   SRB Event Calculator
============================================ */


const srbDropdown =
document.getElementById("srbHoursOnly");


if(srbDropdown){

    for(let i = 1; i <= 64; i++){

        let option =
        document.createElement("option");

        option.value = i;

        option.textContent =
        i + (i === 1 ? " Hour" : " Hours");

        srbDropdown.appendChild(option);

    }

}



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

        3600 *

        50

    );

}



if(calculateSRBOnly){

calculateSRBOnly.addEventListener(
"click",
function(){


const hours =
Number(
document.getElementById("srbHoursOnly").value
);



const perHour =
calculateHourlySRB();



const earnings =
perHour * hours;



document.getElementById("displaySRBHours")
.textContent =
hours;



document.getElementById("srbPerHour")
.textContent =
perHour.toFixed(4);



document.getElementById("srbOnlyResult")
.textContent =
earnings.toFixed(4);



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


    let income =

        parcels *

        0.00000000158;



    income *=
    getBadgeBonus(badges);



    const monthSeconds =
    60 * 60 * 24 * 30;



    const srbSeconds =
    srbHours * 3600;



    const regularSeconds =
    monthSeconds - srbSeconds;



    const boost =
    getBoostMultiplier(parcels);



    const boosted =
    boostHours / 24;



    const unboosted =
    1 - boosted;



    const regular =

        income *

        regularSeconds *

        (

            (boosted * boost)

            +

            unboosted

        );



    const srb =

        income *

        srbSeconds *

        50;



    return (

        regular +

        srb

    ) / 30;


}




function convertGoalToDaily(amount,type){


switch(type){


case "hour":
return amount * 24;


case "day":
return amount;


case "week":
return amount / 7;


case "month":
return amount / 30.4375;


case "year":
return amount / 365;


default:
return amount;


}


}



if(calculateGoal){

calculateGoal.addEventListener(
"click",
function(){



const goal =
Number(
document.getElementById("dailyGoal").value
);



const goalType =
document.getElementById("goalType").value;



const dailyGoal =
convertGoalToDaily(
goal,
goalType
);



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

)

<

dailyGoal

){



needed++;



if(needed > 10000){

break;

}


}




document.getElementById("goalAmount")
.textContent =
goal.toFixed(2);



document.getElementById("dailyEquivalent")
.textContent =
dailyGoal.toFixed(2);



const labels = {

hour:"per hour",

day:"per day",

week:"per week",

month:"per month",

year:"per year"

};



document.getElementById("goalLabel")
.textContent =
labels[goalType];



document.getElementById("goalParcelsNeeded")
.textContent =
needed;



document.getElementById("additionalParcelsNeeded")
.textContent =
Math.max(
0,
needed-current
);



});

}

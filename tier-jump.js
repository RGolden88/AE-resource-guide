document.getElementById("calculateTierJump").addEventListener("click", function(){

const parcels = Number(document.getElementById("currentParcels").value);
const currentAB = Number(document.getElementById("currentAB").value);
const abPerDay = Number(document.getElementById("abPerDay").value);

let currentBoost;
let nextTier;

if(parcels <=150){
    currentBoost="30x";
    nextTier=150;
}
else if(parcels<=220){
    currentBoost="20x";
    nextTier=220;
}
else if(parcels<=290){
    currentBoost="15x";
    nextTier=290;
}
else if(parcels<=365){
    currentBoost="12x";
    nextTier=365;
}
else if(parcels<=435){
    currentBoost="10x";
    nextTier=435;
}
else if(parcels<=545){
    currentBoost="8x";
    nextTier=545;
}
else if(parcels<=625){
    currentBoost="7x";
    nextTier=625;
}
else if(parcels<=730){
    currentBoost="6x";
    nextTier=730;
}
else if(parcels<=875){
    currentBoost="5x";
    nextTier=875;
}
else if(parcels<=1100){
    currentBoost="4x";
    nextTier=1100;
}
else if(parcels<=1500){
    currentBoost="3x";
    nextTier=1500;
}
else{
    currentBoost="2x";
    nextTier=parcels;
}

const parcelsNeeded=Math.max(nextTier-parcels,0);

const abNeeded=parcelsNeeded*100;

const remainingAB=Math.max(abNeeded-currentAB,0);

const daysNeeded=
abPerDay>0
?Math.ceil(remainingAB/abPerDay)
:0;

document.getElementById("currentTier").textContent=currentBoost;
document.getElementById("nextTier").textContent=nextTier;
document.getElementById("neededParcels").textContent=parcelsNeeded;
document.getElementById("neededAB").textContent=abNeeded;
document.getElementById("remainingAB").textContent=remainingAB;
document.getElementById("daysNeeded").textContent=daysNeeded;

let recommendation="";

if(parcelsNeeded===0){

recommendation="You are currently at the top of your boost tier. Continue saving Atlas Bucks until you're ready to jump into the next tier.";

}
else if(daysNeeded<7){

recommendation="You're very close! Continue saving and buy all of your parcels together.";

}
else if(daysNeeded<30){

recommendation="Keep saving Atlas Bucks. Tier jumping is usually more efficient than buying one parcel at a time.";

}
else{

recommendation="This is a long-term jump. Stay boosted, collect diamonds, complete challenges, and save your Atlas Bucks until you're ready.";

}

document.getElementById("tierRecommendation").textContent=recommendation;

});
const calculateRent = document.getElementById("calculateRent");
const calculateDiamonds = document.getElementById("calculateDiamonds");
const calculateGoal = document.getElementById("calculateGoal");

function getBoostMultiplier(totalParcels) {
  if (totalParcels <= 150) {
    return 30;
  } else if (totalParcels <= 220) {
    return 20;
  } else if (totalParcels <= 290) {
    return 15;
  } else if (totalParcels <= 365) {
    return 12;
  } else if (totalParcels <= 435) {
    return 10;
  } else if (totalParcels <= 545) {
    return 8;
  } else if (totalParcels <= 625) {
    return 7;
  } else if (totalParcels <= 730) {
    return 6;
  } else if (totalParcels <= 875) {
    return 5;
  } else if (totalParcels <= 1100) {
    return 4;
  } else if (totalParcels <= 1500) {
    return 3;
  } else {
    return 2;
  }
}

function getBadgeBonus(badges) {
  if (badges >= 101) {
    return 1.25;
  } else if (badges >= 61) {
    return 1.20;
  } else if (badges >= 31) {
    return 1.15;
  } else if (badges >= 11) {
    return 1.10;
  } else if (badges >= 1) {
    return 1.05;
  } else {
    return 1;
  }
}


function getBuySuggestion(totalParcels, badges) {
  if (totalParcels < 40) {
    return "Buy parcels first.";
  }

  if (totalParcels >= 40 && badges === 0) {
    return "Consider buying your first badge.";
  }

  if (totalParcels >= 150 && badges < 11) {
    return "Badges may be worth considering.";
  }

  if (badges >= 11) {
    return "Parcels may be better until your next badge tier.";
  }

  return "Keep building parcels and watch your next badge tier.";
}

function estimateDailyRentFromParcels(totalParcels, badges, boostHours, srbHours) {
  const averageParcelRent = 0.00000000158;

  let rentPerSecond = totalParcels * averageParcelRent;

  rentPerSecond = rentPerSecond * getBadgeBonus(badges);

  const regularBoostMultiplier = getBoostMultiplier(totalParcels);
  const srbBoostMultiplier = 50;

  const secondsPerDay = 60 * 60 * 24;

  const boostedPart = boostHours / 24;
  const unboostedPart = 1 - boostedPart;

  const regularDailyRent =
    rentPerSecond *
    secondsPerDay *
    ((boostedPart * regularBoostMultiplier) + unboostedPart);

  const srbDailyAverage =
    rentPerSecond *
    ((srbHours * 60 * 60) / 30) *
    srbBoostMultiplier;

  return regularDailyRent + srbDailyAverage;
}

/* -----------------------------
   Main Rent Calculator
----------------------------- */

calculateRent.addEventListener("click", function () {
  const common = Number(document.getElementById("commonParcels").value);
  const rare = Number(document.getElementById("rareParcels").value);
  const epic = Number(document.getElementById("epicParcels").value);
  const legendary = Number(document.getElementById("legendaryParcels").value);
  const lpuCount = Number(document.getElementById("lpuCount").value);
  const badges = Number(document.getElementById("badgesOwned").value);
  const boostHours = Number(document.getElementById("boostHours").value);
  const srbHours = Number(document.getElementById("srbHours").value);

  if (
    isNaN(common) ||
    isNaN(rare) ||
    isNaN(epic) ||
    isNaN(legendary) ||
    isNaN(lpuCount) ||
    isNaN(badges) ||
    isNaN(boostHours) ||
    isNaN(srbHours)
  ) {
    alert("Please make sure every calculator box has a number.");
    return;
  }

  const totalParcels = common + rare + epic + legendary;

  /*
    LPU logic:
    LPUs make a parcel earn like legendary.
    This calculator upgrades common first,
    then rare, then epic.
  */

  let remainingLPU = lpuCount;

  const upgradedCommon = Math.min(remainingLPU, common);
  remainingLPU = remainingLPU - upgradedCommon;

  const upgradedRare = Math.min(remainingLPU, rare);
  remainingLPU = remainingLPU - upgradedRare;

  const upgradedEpic = Math.min(remainingLPU, epic);
  remainingLPU = remainingLPU - upgradedEpic;

  const normalCommon = common - upgradedCommon;
  const normalRare = rare - upgradedRare;
  const normalEpic = epic - upgradedEpic;

  const legendaryEarningParcels =
    legendary + upgradedCommon + upgradedRare + upgradedEpic;

  const commonRent = normalCommon * 0.0000000011;
  const rareRent = normalRare * 0.0000000016;
  const epicRent = normalEpic * 0.0000000022;
  const legendaryRent = legendaryEarningParcels * 0.0000000044;

  let rentPerSecond =
    commonRent + rareRent + epicRent + legendaryRent;

  const badgeBonus = getBadgeBonus(badges);

  rentPerSecond = rentPerSecond * badgeBonus;

  const secondsPerMonth = 60 * 60 * 24 * 30;

  const regularBoostMultiplier = getBoostMultiplier(totalParcels);
  const srbBoostMultiplier = 50;

  const srbSeconds = srbHours * 60 * 60;
  const regularMonthSeconds = secondsPerMonth - srbSeconds;

  const boostedPart = boostHours / 24;
  const unboostedPart = 1 - boostedPart;

  const regularMonthlyRent =
    rentPerSecond *
    regularMonthSeconds *
    ((boostedPart * regularBoostMultiplier) + unboostedPart);

  const srbMonthlyRent =
    rentPerSecond *
    srbSeconds *
    srbBoostMultiplier;

  const monthlyRent =
    regularMonthlyRent + srbMonthlyRent;

  /*
    Portfolio value estimate:
    1 parcel costs 100 AB.
    If buying $100 AB packs gives 2400 AB,
    then each parcel is worth about $4.17.
  */

  const dollarValuePerParcel = 100 / 24;
  const portfolioValue = totalParcels * dollarValuePerParcel;

  const buySuggestion =
    getBuySuggestion(totalParcels, badges);

  document.getElementById("totalParcels").textContent =
    totalParcels;

  document.getElementById("boostTier").textContent =
    regularBoostMultiplier + "x";

  document.getElementById("monthlyRent").textContent =
    monthlyRent.toFixed(2);
    const dailyRent = monthlyRent / 30;
    const weeklyRent = dailyRent * 7;
    const yearlyRent = monthlyRent * 12;

    const parcelsToNextTier = getParcelsToNextTier(totalParcels);
    const badgesToNextLevel = getBadgesToNextLevel(badges);

  document.getElementById("buySuggestion").textContent =
    buySuggestion;

  document.getElementById("portfolioValue").textContent =
    portfolioValue.toFixed(2);

  document.getElementById("dailyRent").textContent =
     dailyRent.toFixed(2);

   document.getElementById("weeklyRent").textContent =
     weeklyRent.toFixed(2);

   document.getElementById("yearlyRent").textContent =
     yearlyRent.toFixed(2);

   document.getElementById("parcelsToNextTier").textContent =
     parcelsToNextTier;

   document.getElementById("badgesToNextLevel").textContent =
     badgesToNextLevel;
  
});

/* -----------------------------
   Diamond Calculator
----------------------------- */

calculateDiamonds.addEventListener("click", function () {
  const diamonds = Number(document.getElementById("diamondsOwned").value);
  const spinsPerDay = Number(document.getElementById("spinsPerDay").value);

  if (isNaN(diamonds) || isNaN(spinsPerDay)) {
    alert("Please enter numbers for diamonds and spins.");
    return;
  }

  let days = 0;

  if (spinsPerDay > 0) {
    days = diamonds / spinsPerDay;
  }

  document.getElementById("diamondDays").textContent =
    days.toFixed(1);
});

function getParcelsToNextTier(totalParcels) {
  const tiers = [150, 220, 290, 365, 435, 545, 625, 730, 875, 1100, 1500];

  for (let i = 0; i < tiers.length; i++) {
    if (totalParcels < tiers[i]) {
      return tiers[i] - totalParcels;
    }
  }

  return 0;
}

function getBadgesToNextLevel(badges) {
  const badgeLevels = [1, 11, 31, 61, 101];

  for (let i = 0; i < badgeLevels.length; i++) {
    if (badges < badgeLevels[i]) {
      return badgeLevels[i] - badges;
    }
  }

  return 0;
}

calculateGoal.addEventListener("click", function () {
  const common = Number(document.getElementById("commonParcels").value);
  const rare = Number(document.getElementById("rareParcels").value);
  const epic = Number(document.getElementById("epicParcels").value);
  const legendary = Number(document.getElementById("legendaryParcels").value);
  const badges = Number(document.getElementById("badgesOwned").value);
  const boostHours = Number(document.getElementById("boostHours").value);
  const srbHours = Number(document.getElementById("srbHours").value);
  const dailyGoal = Number(document.getElementById("dailyGoal").value);

  const currentParcels = common + rare + epic + legendary;

  let testParcels = currentParcels;

  while (
    estimateDailyRentFromParcels(testParcels, badges, boostHours, srbHours) < dailyGoal
  ) {
    testParcels++;

    if (testParcels > 10000) {
      break;
    }
  }

  const additionalParcels = testParcels - currentParcels;

  document.getElementById("goalAmount").textContent =
    dailyGoal.toFixed(2);

  document.getElementById("goalParcelsNeeded").textContent =
    testParcels;

  document.getElementById("additionalParcelsNeeded").textContent =
    additionalParcels;
});
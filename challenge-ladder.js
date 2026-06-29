const calculateChecklist = document.getElementById("calculateChecklist");
const clearChecklist = document.getElementById("clearChecklist");

calculateChecklist.addEventListener("click", function () {
  const doneChallenges = document.querySelectorAll(".done-challenge");
  const plannedChallenges = document.querySelectorAll(".planned-challenge");

  let completedPoints = 0;
  let plannedPoints = 0;

  doneChallenges.forEach(function (challenge) {
    if (challenge.checked) {
      completedPoints += Number(challenge.dataset.points);
    }
  });

  plannedChallenges.forEach(function (challenge) {
    if (challenge.checked) {
      plannedPoints += Number(challenge.dataset.points);
    }
  });

  const projectedPoints = completedPoints + plannedPoints;
  const pointsNeeded = Math.max(1600 - projectedPoints, 0);

  document.getElementById("completedPoints").textContent = completedPoints;
  document.getElementById("plannedPoints").textContent = plannedPoints;
  document.getElementById("projectedPoints").textContent = projectedPoints;
  document.getElementById("neededChecklistPoints").textContent = pointsNeeded;
});

clearChecklist.addEventListener("click", function () {
  const boxes = document.querySelectorAll("input[type='checkbox']");

  boxes.forEach(function (box) {
    box.checked = false;
  });

  document.getElementById("completedPoints").textContent = 0;
  document.getElementById("plannedPoints").textContent = 0;
  document.getElementById("projectedPoints").textContent = 0;
  document.getElementById("neededChecklistPoints").textContent = 1600;
});
//DOM
const cookieBtn = document.getElementById("cookieBtn");
const cookieDisplay = document.getElementById("cookieDisplay");
const cpcDisplay = document.getElementById("cpcDisplay");
const cpsDisplay = document.getElementById("cpsDisplay");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");
const upgradesDiv = document.getElementById("upgrades");

//Upgrade data
const cpcUpgrade = {
  id: 0,
  name: "CPC Upgrade",
  cost: 50,
  increase: 1,
};
//local list of upgrade objects
let upgradeData = [];

//Counters
let cookies = parseInt(localStorage.getItem("cookies")) || 0;
let cps = parseInt(localStorage.getItem("cps")) || 0; //cookies per second
let cpc = parseInt(localStorage.getItem("cpc")) || 1; // cookies per click
let upgradeLevel =
  JSON.parse(localStorage.getItem("upgradeLevel")) || new Array(11).fill(0); // Level of each upgrade

//Play upgrade sound
function playSuccessSound() {
  const Success = new Audio("./assets/yay.mp3");
  Success.play();
}

//Play click sound
function playClickSound() {
  const Click = new Audio("./assets/click.mp3");
  Click.play();
}

//Increase cpc and cps and increase upgrade level in array
function upgradeIncreases(listOfUpgrades, currentIndex) {
  const upgradeCostTxt = document.getElementById(
    `UpgradeCost${listOfUpgrades[currentIndex].id}`
  );

  currentCost =
    listOfUpgrades[currentIndex].cost +
    upgradeLevel[currentIndex] * listOfUpgrades[currentIndex].cost * 0.2;

  if (cookies >= currentCost) {
    //to display the correct text when not enough cookies for upgrade after pressing button
    nextCost =
      listOfUpgrades[currentIndex].cost +
      (upgradeLevel[currentIndex] + 1) *
        listOfUpgrades[currentIndex].cost *
        0.2;

    playSuccessSound();

    if (currentIndex == 0) {
      cookies = cookies - currentCost;
      cpc = cpc + listOfUpgrades[currentIndex].increase;
      upgradeLevel[currentIndex]++;
      upgradeCostTxt.textContent = `Cost: ${nextCost}`;
      save();
      loadCounters();
    } else {
      cookies = cookies - listOfUpgrades[currentIndex].cost;
      cps = cps + listOfUpgrades[currentIndex].increase;
      upgradeLevel[currentIndex]++;
      upgradeCostTxt.textContent = `Cost: ${nextCost}`;
      save();
      loadCounters();
    }
  } else {
    upgradeError();
  }
}

//Function to create new div, button and other elements for an upgrade
function createUpgradeElements(listOfUpgrades, currentIndex) {
  const createUpgradeDiv = document.createElement("div");
  const createUpgradeBtn = document.createElement("button");
  const createUpgradeTitle = document.createElement("h3");
  const createUpgradeCost = document.createElement("h4");

  //Increase each upgrade cost per level of upgrade
  let currentCost =
    listOfUpgrades[currentIndex].cost +
    upgradeLevel[currentIndex] * listOfUpgrades[currentIndex].cost * 0.2;

  createUpgradeDiv.setAttribute(
    "id",
    `Upgrade${listOfUpgrades[currentIndex].id}`
  );

  createUpgradeCost.setAttribute(
    "id",
    `UpgradeCost${listOfUpgrades[currentIndex].id}`
  );

  if (currentIndex == 0) {
    createUpgradeTitle.textContent = `${listOfUpgrades[currentIndex].name}: +${listOfUpgrades[currentIndex].increase} CPC`;
  } else {
    createUpgradeTitle.textContent = `${listOfUpgrades[currentIndex].name}: +${listOfUpgrades[currentIndex].increase} CPS`;
  }

  createUpgradeCost.textContent = `Cost: ${currentCost}`;
  createUpgradeBtn.textContent = "Upgrade";
  createUpgradeBtn.addEventListener("click", () =>
    upgradeIncreases(listOfUpgrades, currentIndex)
  );

  // Append the button and title to the div
  createUpgradeDiv.appendChild(createUpgradeTitle);
  createUpgradeDiv.appendChild(createUpgradeBtn);
  createUpgradeDiv.appendChild(createUpgradeCost);

  //append new div to the upgradesDiv
  upgradesDiv.appendChild(createUpgradeDiv);
}

// fetch API
async function handleGetUpgrades() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  upgradeData = await response.json();

  //add cpc upgrade object to the beginning of the list of upgrades
  upgradeData.unshift(cpcUpgrade);

  //for loop looping through upgradeData calling previous functions to create upgrades with event listener
  for (let index = 0; index < upgradeData.length; index++) {
    createUpgradeElements(upgradeData, index);
  }
}

//Increse cookies by cps
function increaseByCps() {
  cookies = cookies + cps;
  cookieDisplay.textContent = cookies;
  localStorage.setItem("cookies", cookies);
}

//Increase cookies by cpc
function increaseByCpc() {
  playClickSound();
  cookies = cookies + cpc;
  cookieDisplay.textContent = cookies;
  localStorage.setItem("cookies", cookies);
}
//Increase cookies when button is clicked
cookieBtn.addEventListener("click", increaseByCpc);

//Hide error message
function hideErrorMsg(message) {
  message.style.visibility = "hidden";
}

//Sound effect and error message
function upgradeError() {
  const errorMsg = document.getElementById("errorMsg");
  const errorAudio = new Audio("./assets/errorAudio.mp3");
  errorAudio.play();

  errorMsg.style.visibility = "visible";

  setTimeout(() => hideErrorMsg(errorMsg), 1200);
}

//Load counters
function loadCounters() {
  cookies = parseInt(localStorage.getItem("cookies")) || 0;
  cps = parseInt(localStorage.getItem("cps")) || 0;
  cpc = parseInt(localStorage.getItem("cpc")) || 1;
  upgradeLevel = JSON.parse(localStorage.getItem("upgradeLevel"));
  cookieDisplay.textContent = cookies;
  cpcDisplay.textContent = cpc;
  cpsDisplay.textContent = cps;
}

//Save gamestate
function save() {
  localStorage.setItem("cpc", cpc);
  localStorage.setItem("cps", cps);
  localStorage.setItem("cookies", cookies);
  localStorage.setItem("upgradeLevel", JSON.stringify(upgradeLevel));
}

//Update and then save gamestate
function saveAndUpdate() {
  increaseByCps();
  loadCounters();
  save();
}

//Save sound
function saveSound() {
  const saveAudio = new Audio("./assets/saveAudio.mp3");
  saveAudio.play();
}

//Update every second
setInterval(saveAndUpdate, 1000);

//Reset function
function reset() {
  localStorage.setItem("cookies", 0);
  localStorage.setItem("cpc", 1);
  localStorage.setItem("cps", 0);
  localStorage.setItem("upgradeLevel", JSON.stringify(Array(11).fill(0)));
  loadCounters();
  location.reload(); // refresh page to update cost values on shop
}

//Reset on click
resetBtn.addEventListener("click", reset);

//Save on click
saveBtn.addEventListener("click", save);
//Sound on click
saveBtn.addEventListener("click", saveSound);

//fetch API
handleGetUpgrades();

//DOM
const cookieBtn = document.getElementById("cookieBtn");
const cookieDisplay = document.getElementById("cookieDisplay");
const cpcDisplay = document.getElementById("cpcDisplay");
const cpsDisplay = document.getElementById("cpsDisplay");
const resetBtn = document.getElementById("resetBtn");
const upgradesDiv = document.getElementById("upgrades");

//Upgrade data
const cpcUpgrade = {
  id: 0,
  name: "CPC Upgrade",
  cost: 50,
  increase: 1,
};
let upgradeData = [];

//Counters
let cookies = parseInt(localStorage.getItem("cookies")) || 0;
let cps = parseInt(localStorage.getItem("cps")) || 0; //cookies per second
let cpc = parseInt(localStorage.getItem("cpc")) || 1; // cookies per click
let upgradeLevel = new Array(11).fill(0); // Level of each upgrade

//Load preferences

//Increase cpc and cps function (arguments from a list) and Increase upgrade level in array
function upgradeIncreases(listOfUpgrades, currentIndex) {
  // debug
  console.log("Button clicked for upgrade", listOfUpgrades[currentIndex]);
  console.log("Current cookies:", cookies);
  console.log("Upgrade price:", listOfUpgrades[currentIndex].cost);
  console.log("Upgrade increase:", listOfUpgrades[currentIndex].increase);

  if (cookies >= listOfUpgrades[currentIndex].cost) {
    if (currentIndex == 0) {
      cookies = cookies - listOfUpgrades[currentIndex].cost;
      cpc = cpc + listOfUpgrades[currentIndex].increase;
      upgradeLevel[currentIndex]++;
      save();
      loadCounters();
    } else {
      cookies = cookies - listOfUpgrades[currentIndex].cost;
      cps = cps + listOfUpgrades[currentIndex].increase;
      upgradeLevel[currentIndex]++;
      save();
      loadCounters();
    }
  }
}

//Create new div, button and p element for an upgrade function
function createUpgradeElements(listOfUpgrades, currentIndex) {
  const createUpgradeDiv = document.createElement("div");
  const createUpgradeBtn = document.createElement("button");
  const createUpgradeTitle = document.createElement("p");

  createUpgradeDiv.setAttribute(
    "id",
    `Upgrade${listOfUpgrades[currentIndex].id}`
  );

  createUpgradeTitle.textContent = listOfUpgrades[currentIndex].name;
  createUpgradeBtn.textContent = "Upgrade";
  createUpgradeBtn.addEventListener("click", () =>
    upgradeIncreases(listOfUpgrades, currentIndex)
  );

  // Append the button and title to the div
  createUpgradeDiv.appendChild(createUpgradeTitle);
  createUpgradeDiv.appendChild(createUpgradeBtn);

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

  //for loop looping through upgradeData calling previous functions to create upgrades using addevent listener
  for (let index = 0; index < upgradeData.length; index++) {
    console.log(upgradeData[index]);
    createUpgradeElements(upgradeData, index);
  }
}

handleGetUpgrades();

//Increse cookies by cps
function increaseByCps() {
  cookies = cookies + cps;
  cookieDisplay.textContent = cookies;
  localStorage.setItem("cookies", cookies);
}

//Increase cookies by cpc
function increaseByCpc() {
  cookies = cookies + cpc;
  cookieDisplay.textContent = cookies;
  localStorage.setItem("cookies", cookies);
}
//Increase cookies when button is clicked
cookieBtn.addEventListener("click", increaseByCpc);

//Load counters
function loadCounters() {
  cookies = parseInt(localStorage.getItem("cookies")) || 0;
  cps = parseInt(localStorage.getItem("cps")) || 0;
  cpc = parseInt(localStorage.getItem("cpc")) || 1;
  cookieDisplay.textContent = cookies;
  cpcDisplay.textContent = cpc;
  cpsDisplay.textContent = cps;
}

//Save gamestate
function save() {
  localStorage.setItem("cpc", cpc);
  localStorage.setItem("cps", cps);
  localStorage.setItem("cookies", cookies);
}

//Save preferences function

//Update and then save gamestate
function saveAndUpdate() {
  increaseByCps();
  loadCounters();
  save();
}

//Update every second
setInterval(saveAndUpdate, 1000);

//Reset function
function reset() {
  localStorage.setItem("cookies", 0);
  localStorage.setItem("cpc", 1);
  localStorage.setItem("cps", 0);
  loadCounters();
}

//Reset on click
resetBtn.addEventListener("click", reset);

//DOM
const cookieBtn = document.getElementById("cookieBtn");
const cookieDisplay = document.getElementById("cookieDisplay");
const cpcDisplay = document.getElementById("cpcDisplay");
const cpsDisplay = document.getElementById("cpsDisplay");

let upgradeData = [];

//Counters
let cookies = parseInt(localStorage.getItem("cookies")) || 0;
let cps = parseInt(localStorage.getItem("cps")) || 0; //cookies per second
let cpc = parseInt(localStorage.getItem("cpc")) || 1; // cookies per click
let upgradeLevel = []; // Level of each upgrade

//Load preferences

//Create button and p element function

//Increase cpc and cps function (arguments from a list)
//Increase upgrade level in array
//

// fetch API
async function handleGetUpgrades() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );

  upgradeData = await response.json();

  //for loop looping through upgradeData calling previous functions to create upgrades using addevent listener

  for (let index = 0; index < upgradeData.length; index++) {
    debugger;
    console.log(upgradeData[index]);
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

//Load other counters
function loadCounters() {
  cps = parseInt(localStorage.getItem("cps")) || 1;
  cpc = parseInt(localStorage.getItem("cpc")) || 1;
  cpcDisplay.textContent = cpc;
  cpsDisplay.textContent = cps;
}

//Save gamestate
function save() {
  localStorage.setItem("cpc", cpc);
  localStorage.setItem("cps", cps);
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

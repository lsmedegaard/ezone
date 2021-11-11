"use strict";

let progress = "types";
let choices = [];

let inputObject = {
  fullName: "",
  email: "",
  password: "",
  types: [],
  games: [],
  areas: [],
};

/* loadJSON(); */
start();

function start() {
  addEventlisterners();
  addAnimations();
}

async function loadJSON() {
  const jsonData = await import("/data.json");
  clearOptions();
  prepareObjects(jsonData);
  addEventlisterners();
}

function prepareJsonData(jsonProgress) {
  let noSpaceStrings = [];
  let typeArray = [];
  jsonProgress.forEach((type) => {
    typeArray = type.split(":");
    // console.log(typeArray);
    typeArray = typeArray.join("");
    // console.log(typeArray);
    typeArray = typeArray.split(" ");
    typeArray = typeArray.join("");
    typeArray = typeArray.split("/");
    typeArray = typeArray.join("");
    typeArray = typeArray.split("-");
    typeArray = typeArray.join("");
    typeArray = typeArray.toLowerCase();

    noSpaceStrings.push(typeArray);

    // console.log(typeArray);
  });

  return noSpaceStrings;
}

function prepareObjects(json) {
  const template = document.querySelector("#checkbox_template");
  let jsonProgress;

  if (progress === "types") {
    jsonProgress = json.types;
    /* progress = "games"; */
  }
  if (progress === "games") {
    jsonProgress = json.games;
    /*  progress = "areas"; */
  }
  if (progress === "areas") {
    jsonProgress = json.areas;
    /* progress = "submit"; */
  }

  let noSpaceStrings = prepareJsonData(jsonProgress);
  let j = 0;
  noSpaceStrings.forEach((types) => {
    const gameChoiceType = template.content.cloneNode(true);
    gameChoiceType.querySelector("div").id = "wrapper_" + types;
    gameChoiceType.querySelector("input").id = "input_" + types;
    gameChoiceType.querySelector("input").name = "progress_" + progress;
    gameChoiceType.querySelector("input").value = types;
    gameChoiceType.querySelector("label").setAttribute("for", types);
    gameChoiceType.querySelector("label").textContent = jsonProgress[j].toUpperCase();
    gameChoiceType.querySelector(`#wrapper_${types}`).style.backgroundImage = `url(/images/${progress}/${types}.jpg)`;
    document.querySelector(".checkboxes").appendChild(gameChoiceType);

    /*  if (inputObject[progress]) {
      console.log(inputObject[progress]);
      document.querySelector(`#input_${types}`).checked = true;
    } */

    // console.log(gameChoiceType);

    j++;
  });

  changeTextIntro();
}

const textIntroTypes = {
  h2: "Types Of Game",
  h3: "What type of games do you want to improve your skills at?",
};

const textIntroGames = {
  h2: "Choose Games",
  h3: "What games do you want to improve your skills at?",
};

const textIntroAreas = {
  h2: "Choose Areas",
  h3: "Choose which areas you want to improve",
};

function changeTextIntro() {
  if (progress === "types") {
    document.querySelector("#game_types_form h2").textContent = textIntroTypes.h2;
    document.querySelector("#game_types_form h3").textContent = textIntroTypes.h3;
  }
  if (progress === "games") {
    document.querySelector("#game_types_form h2").textContent = textIntroGames.h2;
    document.querySelector("#game_types_form h3").textContent = textIntroGames.h3;
  }
  if (progress === "areas") {
    document.querySelector("#game_types_form h2").textContent = textIntroAreas.h2;
    document.querySelector("#game_types_form h3").textContent = textIntroAreas.h3;
  }
}

function addAnimations() {
  document.querySelector("h1").classList.add("titleslide");
  document.querySelector("#identity-form").classList.add("fadein");
  document.querySelector("#identity-form").addEventListener("animationend", () => {
    document.querySelector("#identity-form").classList.remove("fadein");
    document.querySelector("#identity .next").addEventListener("mousedown", () => {
      document.querySelector("#identity-form").classList.add("fadeup");
      document.querySelector("#game_types_form").classList.remove("hide");
      document.querySelector("#game_types_form").classList.add("nextForm");
      document.querySelector("#identity-form").style.display = "none";
    });
  });
}

function addEventlisterners() {
  // console.log("adding eventlisteners");
  let allCheckboxes = document.querySelectorAll(`input[type=checkbox]`);
  allCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", handleChoices));
  document.querySelector("#identity .next").addEventListener("mousedown", saveFormIdentity);
  document.querySelector("#game_types_form .next").addEventListener("mousedown", saveSelected);
  document.querySelector(".back").addEventListener("click", backButton);
}

function backButton() {
  saving();

  if (progress === "types") {
    document.querySelector("#identity-form").classList.remove("fadeup");
    document.querySelector("#game_types_form").classList.add("hide");
    document.querySelector("#game_types_form").classList.remove("nextForm");
    document.querySelector("#identity-form").style.display = "block";
  } else if (progress === "submit") {
    document.querySelector("#identity_wrapper").style.display = "grid";
    document.querySelector("#submission_wrapper").innerHTML = null;
    progress = "areas";
  } else if (progress === "areas") {
    progress = "games";
  } else if (progress === "games") {
    progress = "types";
  }
  loadJSON();
}

function saveFormIdentity() {
  let inputArray = [];
  let allInputs = document.querySelectorAll("#identity input");
  allInputs.forEach((input) => {
    // console.log(input.value);
    inputArray.push(input.value);
  });
  inputObject.fullName = inputArray[0];
  inputObject.email = inputArray[1];
  inputObject.password = inputArray[2];

  loadJSON();

  // console.log(inputObject);
}
function saving() {
  let selection = [];
  let selected = document.querySelectorAll(".selected_boxes input");
  selected.forEach((sel) => {
    // console.log(sel);
    selection.push(sel.value);
  });
  inputObject[progress] = selection;
}

function saveSelected() {
  saving();
  clearOptions();
  if (progress === "types") {
    progress = "games";
    loadJSON();
    return;
  }
  if (progress === "games") {
    progress = "areas";

    loadJSON();
    return;
  }
  if (progress === "areas") {
    progress = "submit";
    prepareSubmission();
    return;
  }
}

function prepareSubmission() {
  document.querySelector("#identity_wrapper").style.display = "none";

  const template = document.querySelector("#form_template");
  const clone = template.content.cloneNode(true);

  clone.querySelector("#user_name").textContent += inputObject.fullName;

  clone.querySelector("#user_email").textContent += inputObject.email;

  clone.querySelector("#types").textContent += inputObject.types;
  clone.querySelector("#games").textContent += inputObject.games;
  clone.querySelector("#areas").textContent += inputObject.areas;

  clone.querySelector(".back").addEventListener("click", backButton);

  const wrapper = document.querySelector("#submission_wrapper");

  wrapper.appendChild(clone);

  wrapper.querySelector(".submit").addEventListener("click", () => {
    sayingThankYou();
    submitToRestDb();
  });
}

function sayingThankYou() {
  const template = document.querySelector("#thanks");
  const clone = template.content.cloneNode(true);
  const wrapper = document.querySelector("#ezoneforms");

  wrapper.innerHTML = "";
  wrapper.appendChild(clone);
}
function goBack() {
  window.history.back();
}

function submitToRestDb() {
  // console.log("submitting to restDb");
  post();
  function post() {
    const data = inputObject;
    const postData = JSON.stringify(data);
    fetch("https://ezoneform-b1df.restdb.io/rest/userforms", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "618d20e5fc71545b0f5e06cf",
        "cache-control": "no-cache",
      },
      body: postData,
    }).then((res) => res.json());
    // .then((data) => console.log(data));
  }
}

function handleChoices() {
  // console.log("addingChoices");

  if (this.checked) {
    // console.log(this + " = true");
    addingChoice(this);
    /*  document.querySelector(".selected_boxes").appendChild(clone); */
  }
  if (!this.checked) {
    // console.log("removing " + this);
    removingChoice(this);
    /*   document.querySelector(".selected_boxes").appendChild(clone); */
  }
}

function removingChoice(choice) {
  // console.log(choice);
  /*  choices.splice(choices.indexOf(`#clone_${this.value}`)); */
  document.getElementById(`clone_${choice.value}`).remove();
  // console.log(choice);
  // console.log("is " + choice.value + " " + "checked: " + ": " + choice.checked);
}

function addingChoice(choice) {
  // console.log("is " + choice.value + " " + "checked: " + choice.checked);
  let clone = choice.parentElement.cloneNode(true);
  document.querySelector(".selected_boxes").appendChild(clone);
  clone.id = "clone_" + choice.value;
}

function clearOptions() {
  const checkBoxes = document.querySelector(".checkboxes");
  const selectedBoxes = document.querySelector(".selected_boxes");
  selectedBoxes.innerHTML = "";
  checkBoxes.innerHTML = "";
}

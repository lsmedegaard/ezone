"use strict";

let progress = "";
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

function loadJSON() {
  fetch("data.json")
    .then((response) => response.json())
    .then((jsonData) => {
      console.log(jsonData);
      // when loaded, prepare objects
      prepareObjects(jsonData);
      addEventlisterners();
    });
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

  function prepareJsonData() {
    let noSpaceStrings = [];
    let typeArray = [];
    jsonProgress.forEach((type) => {
      typeArray = type.split(":");
      console.log(typeArray);
      typeArray = typeArray.join("");
      console.log(typeArray);
      typeArray = typeArray.split(" ");
      typeArray = typeArray.join("");
      typeArray = typeArray.split("/");
      typeArray = typeArray.join("");
      typeArray = typeArray.split("-");
      typeArray = typeArray.join("");
      typeArray = typeArray.toLowerCase();

      noSpaceStrings.push(typeArray);

      console.log(typeArray);
    });

    return noSpaceStrings;
  }

  let noSpaceStrings = prepareJsonData(json);
  let j = 0;
  noSpaceStrings.forEach((types) => {
    const gameChoiceType = template.content.cloneNode(true);
    gameChoiceType.querySelector("div").id = "wrapper_" + types;
    gameChoiceType.querySelector("input").id = "input_" + types;
    gameChoiceType.querySelector("input").name = "progress_" + progress;
    gameChoiceType.querySelector("input").value = types;
    gameChoiceType.querySelector("label").setAttribute("for", types);
    gameChoiceType.querySelector("label").textContent = jsonProgress[j].toUpperCase();

    gameChoiceType.querySelector(`#wrapper_${types}`).style.backgroundImage = `url(images/${progress}/${types}.jpg)`;
    document.querySelector(".checkboxes").appendChild(gameChoiceType);
    console.log(gameChoiceType);
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
    });
  });
}

function addEventlisterners() {
  console.log("adding eventlisteners");
  let allCheckboxes = document.querySelectorAll(`input[type=checkbox]`);
  allCheckboxes.forEach((checkbox) => checkbox.addEventListener("change", handleChoices));
  document.querySelector("#identity .next").addEventListener("mousedown", saveFormIdentity);
  document.querySelector("#game_types_form .next").addEventListener("mousedown", saveSelected);
}

function saveFormIdentity() {
  let inputArray = [];
  let allInputs = document.querySelectorAll("#identity input");
  allInputs.forEach((input) => {
    console.log(input.value);
    inputArray.push(input.value);
  });
  inputObject.fullName = inputArray[0];
  inputObject.email = inputArray[1];
  inputObject.password = inputArray[2];

  progress = "types";

  loadJSON();

  console.log(inputObject);
}

function saveSelected() {
  let selection = [];
  let selected = document.querySelectorAll(".selected_boxes input");
  selected.forEach((sel) => {
    console.log(sel);
    selection.push(sel.value);
  });
  inputObject[progress] = selection;
  console.log(inputObject);
  clearOptions();
  if (progress === "types") {
    /* progress = "games"; */
    /*  this.addEventListener("click", () => {
    
    }); */
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
    handleSubmission();
    return;
  }

  console.log(progress);
}

function handleSubmission() {
  const wrapper = document.querySelector("#identity_wrapper");
  wrapper.innerHTML = ""; //MÅÅSKE IKKE REMOVE hvis man skal tilbage (måske bare hide??)

  const template = document.querySelector("#form_template");
  const clone = template.content.cloneNode(true);

  clone.querySelector("#user_name").textContent = inputObject.fullName;
  clone.querySelector("#user_email").textContent = inputObject.email;

  clone.querySelector("#types").textContent = inputObject.types;
  clone.querySelector("#games").textContent = inputObject.games;
  clone.querySelector("#areas").textContent = inputObject.areas;
  console.log(clone);

  wrapper.appendChild(clone);

  wrapper.querySelector("button").addEventListener("click", () => {
    submitToRestDb();
  });
}

function submitToRestDb() {
  console.log("submitting to restDb");
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
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
}

function handleChoices() {
  console.log("addingChoices");

  if (this.checked) {
    console.log(this + " = true");
    addingChoice(this);
    /*  document.querySelector(".selected_boxes").appendChild(clone); */
  }
  if (!this.checked) {
    console.log("removing " + this);
    removingChoice(this);
    /*   document.querySelector(".selected_boxes").appendChild(clone); */
  }
}

function removingChoice(choice) {
  console.log(choice);
  /*  choices.splice(choices.indexOf(`#clone_${this.value}`)); */
  document.getElementById(`clone_${choice.value}`).remove();
  console.log(choice);
  console.log("is " + choice.value + " " + "checked: " + ": " + choice.checked);
}

function addingChoice(choice) {
  console.log("is " + choice.value + " " + "checked: " + choice.checked);
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

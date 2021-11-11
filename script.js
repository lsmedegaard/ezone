"use strict";

loadJSON();

let progress = "types";
let choices = [];

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
  const template = document.querySelector("template");
  let jsonProgress;
  if (progress === "types") {
    jsonProgress = json.types;
  }
  if (progress === "games") {
    jsonProgress = json.games;
  }
  if (progress === "areas") {
    jsonProgress = json.areas;
  }

  function prepareJsonData() {
    let noSpaceStrings = [];
    let typeArray = [];
    jsonProgress.forEach((type) => {
      /* = type.split("") */
      /*   if (type.includes(":")) {
        typeArray = type.split(":");
        console.log("something contains a : ");
      }
      if (type.includes(" ")) {
        typeArray = type.split(" ");
        console.log("something contains a space ");
      } */
      typeArray = type.split(":");
      console.log(typeArray);
      typeArray = typeArray.join("");
      console.log(typeArray);
      typeArray = typeArray.split(" ");
      typeArray = typeArray.join("");
      typeArray = typeArray.split("/");
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
}

/*   const gameChoiceType = document.createElement("div");
  const gameChoiceInput = document.createElement("input");
  gameChoiceType.className = "checkbox_wrapper";
  gameChoiceType.id = "wrapper_" + json.types[1];

  gameChoiceInput.type = "checkbox";
  gameChoiceInput.id = "input_" + json.types[1]; */

function addEventlisterners() {
  console.log("adding eventlisteners");
  let allCheckboxes = document.querySelectorAll(`input[type=checkbox]`);
  allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", handleChoices);
  });

  document.querySelector(".next").addEventListener("mousedown", saveFormInput);
}

function saveFormInput() {
  let inputObject = {
    fullName: "",
    email: "",
    password: "",
    types: [],
    games: [],
    areas: [],
  };

  let inputArray = [];
  let allInputs = document.querySelectorAll("#identity input");
  allInputs.forEach((input) => {
    console.log(input.value);
    inputArray.push(input.value);
  });

  inputObject = {
    fullName: inputArray[0],
    email: inputArray[1],
    password: inputArray[2],
  };
  console.log(inputObject);
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

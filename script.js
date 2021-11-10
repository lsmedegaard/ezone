"use strict";

let progress = "games";

function loadJSON() {
  fetch("data.json")
    .then((response) => response.json())
    .then((jsonData) => {
      console.log(jsonData);
      // when loaded, prepare objects
      prepareObjects(jsonData);
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

  function prepareJsonData(json) {
    let noSpaceStrings = [];
    let typeArray = [];
    jsonProgress.forEach((type) => {
      /* = type.split("") */
      if (type.includes(":")) {
        typeArray = type.split(":");
        console.log("something contains a : ");
        /* typeArray.pop(`${typeArray.indexOf(":")}`); */
      }
      if (type.includes(" ")) {
        typeArray = type.split(" ");
        console.log("something contains a space ");
      }
      typeArray = type.split(":");
      typeArray = type.split(" ");
      typeArray = typeArray.join("");
      /* typeArray.pop(`${typeArray.indexOf(":")}`); */
      noSpaceStrings.push(typeArray);
      /*  typeArray = typeArray.toLowerCase() */

      console.log(typeArray);
    });

    return noSpaceStrings;
  }

  let noSpaceStrings = prepareJsonData(json);
  let j = 0;
  jsonProgress.forEach((types) => {
    const gameChoiceType = template.content.cloneNode(true);
    gameChoiceType.querySelector("div").id = "wrapper_" + noSpaceStrings[j];
    gameChoiceType.querySelector("input").id = "input_" + noSpaceStrings[j];
    gameChoiceType.querySelector("input").name = "game_types";
    gameChoiceType.querySelector("input").value = noSpaceStrings[j];
    gameChoiceType.querySelector("label").setAttribute("for", noSpaceStrings[j]);
    gameChoiceType.querySelector("label").textContent = jsonProgress[j].toUpperCase();

    gameChoiceType.querySelector(`#wrapper_${noSpaceStrings[j]}`).style.backgroundImage = `url(images/types/${noSpaceStrings[j]}.jpg)`;
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

loadJSON();

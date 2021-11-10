"use strict";

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
  let noSpaceStrings = [];
  json.types.forEach((type) => {
    let typeArray = type.split(" ");
    typeArray = typeArray.join("");
    typeArray = typeArray.toLowerCase();
    console.log(typeArray);

    noSpaceStrings.push(typeArray);
  });

  let j = 0;
  json.types.forEach((types) => {
    const gameChoiceType = template.content.cloneNode(true);
    gameChoiceType.querySelector("div").id = "wrapper_" + noSpaceStrings[j];
    gameChoiceType.querySelector("input").id = "input_" + noSpaceStrings[j];
    gameChoiceType.querySelector("input").name = "game_types";
    gameChoiceType.querySelector("input").value = noSpaceStrings[j];
    gameChoiceType.querySelector("label").setAttribute("for", noSpaceStrings[j]);
    gameChoiceType.querySelector("label").textContent = json.types[j].toUpperCase();

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

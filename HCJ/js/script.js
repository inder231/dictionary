"use strict";

const bodyEle = document.querySelector("body");
const checkBox = document.querySelector(".switch input");
const selectOption = document.querySelector(".content select");

const searchBtn = document.querySelector(".search");
const inputEle = document.querySelector("form input");

const dicContainer = document.querySelector(".dictionary_content");
const partOfSpeechNoun = document.querySelector(".partOfSpeechNoun");
const verbEl = document.querySelector(".verb");
const ulEle = document.querySelector(".meanings");

const SynEle = document.querySelector(".syn");
const form = document.querySelector("form");

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

searchBtn.addEventListener("click", () => {
  if (inputEle.value !== "") {
    searching(inputEle.value);
    inputEle.style.border = "";
    inputEle.value = "";
  } else {
    inputEle.style.border = "1px solid red";
  }
});

async function searching(data) {
  try {
    const api_data = await fetch(`${API_URL}/${data}`);
    const result = await api_data.json();
    console.log(result);
    const html = `
      <div class="section">
      <h2>${result[0]?.word}</h2>
      <p>${result[0]?.phonetic}</p>
      </div>
      <img width="72px" height="72px" class="playBtn" src="./images/play.svg" alt="play" />
      `;
    dicContainer.innerHTML = html;
    partOfSpeechNoun.textContent = result[0]?.meanings[0].partOfSpeech;

    const li = `
      <li>
        ${result[0].meanings[0]?.definitions[0]?.definition}
      </li>
      <li>
        ${result[0].meanings[0]?.definitions[1]?.definition}
      </li>
      <li>
        ${result[0].meanings[0]?.definitions[3]?.definition}
      </li>
    `;
    ulEle.innerHTML = li;

    const meaningsArr = result[0]?.meanings;
    SynEle.textContent = "";
    if (!!meaningsArr) {
      for (let ele of meaningsArr) {
        if (ele?.synonyms.length > 0) {
          let arr = ele?.synonyms;
          for (let i = 0; i < arr?.length; i++) {
            SynEle.textContent += arr[i] + " | ";
          }
        }
      }
    }

    let partOfSpeech2 = `
          <div class="verbContent">
            <h3>${result[0]?.meanings[1].partOfSpeech}</h3>
            <p>Meaning</p>
            <ul class="meanings">
              <li>${result[0]?.meanings[1]?.definitions[0]?.definition}</li>
            </ul>
          </div>
    `;
    verbEl.innerHTML = partOfSpeech2;

    const playBtn = document.querySelector(".playBtn");
    playBtn.addEventListener("click", () => {
      const speechWord = result[0]?.word;
      speechText(speechWord);
    });
  } catch (error) {
    console.error(error);
  }
}

// form handler
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searching(inputEle?.value);
  inputEle.value = "";
});

// font select handler
selectOption.addEventListener("change", (e) => {
  let fonts = e.target.value;
  bodyEle.style.fontFamily = fonts;
});

// dark-light mode handler
checkBox.addEventListener("click", () => {
  bodyEle.classList.toggle("dark");
});

// text-to-speech
function speechText(textSpeech) {
  let speechText = new SpeechSynthesisUtterance();
  speechText.text = textSpeech;
  speechText.voice = window.speechSynthesis.getVoices()[0];
  window.speechSynthesis.speak(speechText);
}

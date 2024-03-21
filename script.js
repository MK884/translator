let selectTags = document.querySelectorAll("select"),
  toText = document.querySelector(".to-text"),
  iconTags = document.querySelectorAll(".icons i"),
  exchangeBtn = document.querySelector(".exchange"),
  Btn = document.querySelector("#translate"),
  fromText = document.querySelector(".from-text");

selectTags.forEach((tag, index) => {
  for (const country in countries) {
    // to select english to hindi translations by defualt country
    let selected =
      index == 0
        ? country === "en-GB"
          ? "selected"
          : ""
        : country === "hi-IN"
        ? "selected"
        : "";
    let options = `<option ${selected} value="${country}">${countries[country]}</option>`;
    tag.insertAdjacentHTML("beforeend", options);
  }
});

const translate = async (input, fromLang, toLang) => {
  let api_url = `https://api.mymemory.translated.net/get?q=${input}&langpair=${fromLang}|${toLang}`;
  //   if no input then dont do anything
  if (!input) return;
  toText.setAttribute("placeholder", "translating ...");
  let response = await fetch(api_url);
  let data = await response.json();
  toText.setAttribute("placeholder", "translated");
  toText.value = data.responseData.translatedText;
};

exchangeBtn.addEventListener("click", () => {
  let tempText = fromText.value,
    tempLang = selectTags[0].value;
  selectTags[0].value = selectTags[1].value;
  selectTags[1].value = tempLang;
  fromText.value = toText.value;
  toText.value = tempText;
});

iconTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    if (tag.classList.contains("fa-copy")) {
      if (tag.id === "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      if (tag.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTags[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTags[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});

fromText.addEventListener("keyup", () => {
  toText.value = "";
  toText.setAttribute("placeholder","Translation")
});

Btn.addEventListener("click", () => {
  translate(fromText.value, selectTags[0].value, selectTags[1].value);
});

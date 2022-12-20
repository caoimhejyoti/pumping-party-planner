// global variables
//API variables
let musicApi = 'https://api.deezer.com/version/service/id/method/?parameters';
let musicApiFormat = '&output=json';
//modal variables
let musicModal = document.querySelector('#music-modal');

//button variables
let selectMusicBtnEl = document.querySelector(".music-select");
console.log(selectMusicBtnEl);
let selectCocktailBtnEl = document.querySelector(".cocktail-select");

// Function - brings up music modal dialog TODO: add next function trigger
let musicSelectionFnc = function(){
    musicModal.classList.remove('hidden');
    console.log("musicSelectionFnc is reading");
};





//Select music event listener
selectMusicBtnEl.addEventListener("click", musicSelectionFnc);
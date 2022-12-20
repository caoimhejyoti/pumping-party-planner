// global variables
    //button variables
    let selectMusicBtnEl = document.querySelector(".music-select");
    let selectCocktailBtnEl = document.querySelector(".cocktail-select");
    console.log(selectCocktailBtnEl);
    let cocktailModalEl = document.querySelector("#cocktail-modal");

// TODO: create function that will allow user to select their cocktails
let cocktailSelectionFnc = function(){
    
};

//Select music event listener
//selectMusicBtnEl.addEventListener("click", musicSelectionFnc);
//Select cocktail event listener
//selectCocktailBtnEl.addEventListener("click", cocktailSelectionFnc);

function openModal() {
    
    cocktailModalEl.classList.remove("hidden");
    console.log('inside openmodal');
}
selectCocktailBtnEl.addEventListener("click", openModal);

    //btn.addEventListener("click", openModel);
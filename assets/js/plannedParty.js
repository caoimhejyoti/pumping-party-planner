let cocktailUl = document.querySelector(".cocktailList");
let musicUl = document.querySelector(".musicList");

let cocktailList = JSON.parse(localStorage.getItem("cocktails"));
let musicList = JSON.parse(localStorage.getItem("music"));

console.log(cocktailList);

function loadCocktails() {
    for(let el in cocktailList) {
        let currentEl = cocktailList[el];
        let liEl = document.createElement("li");
        let imgEl = document.createElement("img");
        let pEl = document.createElement("p");
        cocktailUl.appendChild(liEl);
        cocktailUl.appendChild(imgEl);
        cocktailUl.appendChild(pEl);
        liEl.textContent = currentEl.name;
        imgEl.src = currentEl.img;
        let ingredientsList = currentEl.ingredients.split("#");
        console.log(ingredientsList.length);
        for(let lineEl in ingredientsList) {
            let pInnerEl = document.createElement('p');
            pInnerEl.textContent = ingredientsList[lineEl];
            pEl.appendChild(pInnerEl);
        }
        liEl.classList.add(el);
        imgEl.classList.add(el);
        imgEl.classList.add("w-20");
        pEl.classList.add("hidden");
        pEl.classList.add(`_${el}`);
    }
}

function loadMusic() {
    for(let el in musicList) {
        let liEl = document.createElement("li");
        musicUl.appendChild(liEl);
        liEl.textContent = musicList[el].name;
    }
}

function switchDetails(e) {
    console.log("this is working ");
    let cocktailTarget = e.target;
    let cocktailIndex = cocktailTarget.classList[0];
    let showIng = document.querySelector(`p._${cocktailIndex}`);
    if(showIng.classList[0] == "hidden" || showIng.classList[1] == "hidden") {
        showIng.classList.remove("hidden");
        console.log("im working");
    } else showIng.classList.add("hidden");
}

cocktailUl.addEventListener("click", switchDetails);


loadCocktails();
loadMusic();


// add tooltip to say click for ingredients
// add togglable img and ingredients

//button variables
let selectCocktailBtnEl = document.querySelector(".cocktail-select");
//console.log(selectCocktailBtnEl);
let cocktailModalEl = document.querySelector("#cocktail-modal");
let searchButtonEl = document.querySelector("#search-button");
let searchResultsEl = document.querySelector("#search-results");
let searchImageEl = document.querySelector("#search-image");
var radioEl = document.querySelector("#radio-buttons");
//let searchResultsEl = document.querySelector("#search-results");

function clearInputFields() {
    $("#cocktail-name").val("");
    $("#cocktail-ingredient").val("");
}

function removeAllChildren(elem){
    while (elem.lastElementChild) {
        elem.removeChild(elem.lastElementChild);
    }
}

function getIngredients(event){
    let chosenImg = event.target;
    let cocktailID = chosenImg.getAttribute("data-id");
    console.log("getIngredients id " + cocktailID);
    callAPI("lookup", "i", cocktailID);
}

function getIngredientsNEW(id){
    //let chosenImg = event.target;
    //let cocktailID = chosenImg.getAttribute("data-id");
    console.log("getIngredients id " + id);
    //XXX
    callAPI("lookup", "i", id);
    //console.log("returned get ingred = "  + dataReturned);
    //displayIngredients(dataReturned);
}
/*
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
*/

function displayImage(event) {
    //alert('clicked');
    let chosenDrink = event.target;
    const rect = chosenDrink.getBoundingClientRect();
    //alert(rect.top.toFixed());
    
   // console.log(chosenDrink);
    
    let imgValue = chosenDrink.getAttribute("data-img");
    let cocktailID = chosenDrink.getAttribute("data-id");
    let ingredients = chosenDrink.getAttribute("data-ingred");
    //("img = " + imgValue);
    removeAllChildren(searchImageEl);
    let imgEl = document.createElement('img');
    imgEl.setAttribute("src", imgValue);
    imgEl.setAttribute("data-id", cocktailID);
    imgEl.setAttribute("data-ingred", ingredients);
    //temp
    imgEl.style.position = 'absolute';
    //alert(window.scrollY + rect.top);
    //alert(rect.top.toFixed());
    
    //var x = getOffset(chosenDrink).left; 
    //alert(x);
    imgEl.style.top = rect.top.toFixed() + "px";
    

    searchImageEl.classList.remove("hidden");
    searchImageEl.classList.add("w-32");
    searchImageEl.classList.add("w-32");
   searchImageEl.classList.add("mx-auto");
   //temp
   searchImageEl.style.position = 'relative';


   //searchImageEl.classList.add("my-auto");
    
    //searchImageEl.style.setProperty("top", 500, "important");
    //searchImageEl.style.setProperty("top", rect.top.toFixed() + 100, "important");
    //imgEl.addEventListener("click", displayIngredients);
   // const rect1 = searchImageEl.getBoundingClientRect();
    
    searchImageEl.appendChild(imgEl);
   // searchImageEl.scrollIntoView(true);
    //alert(imgEl.offsetTop);
    imgEl.style.top = rect.top.toFixed() + "px";
}

function getAllIngredients(dataObj){
   // console.log("***getAllIngredients " + dataObj.strDrink);
    let strIngredients = [];
    for (let i = 1; i < 15; i++) {
        // console.log("ingredient = " + data.drinks[0]["strIngredient" + i]);
         if (dataObj["strIngredient" + i] != null) {  
           // console.log(dataObj["strMeasure" + i] + "/" + dataObj["strIngredient" + i]);           
             if (dataObj["strMeasure" + i] != null) {
                 strIngredients.push(dataObj["strMeasure" + i] + " " + dataObj["strIngredient" + i]);
             } else {
                 strIngredients.push(dataObj["strIngredient" + i]);
             }
         } else {
             break;
         }
         //console.log(strIngredients);
          
     }
     return strIngredients;
}

function displayData(data){
    console.log("displayData");
    console.log(data);

    searchResultsEl.classList.remove("hidden");
    let ulEl = document.createElement('ul');
    let liEl;
    let linkEl;
    let strIngredients = '';
    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);
    
    var table = document.createElement('table');
    console.log("length = " + data.drinks.length);
    for (var i = 0; i < data.drinks.length; i++){
        var tr = document.createElement('tr');   

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        td1.innerHTML ='<i class="fas fa-cocktail"></i>';
        td1.classList.add("p-2");
        td2.innerHTML = data.drinks[i].strDrink;
        td2.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td2.setAttribute("data-id", data.drinks[i].idDrink);
        td2.setAttribute("data-name", data.drinks[i].strDrink);
        strIngredients = getAllIngredients(data.drinks[i]).join("#");
        if (strIngredients.length > 0) {
            td2.setAttribute("data-ingred", strIngredients);
        }
        
       // console.log(getAllIngredients(data.drinks[i]));
        td2.classList.add("hover:bg-red-300");
        td2.classList.add("rounded-lg");
        td2.classList.add("cursor-pointer");
        td2.classList.add("m-3");
        td3.innerHTML = '<i class="far fa-save"></i>';
        td3.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td3.setAttribute("data-id", data.drinks[i].idDrink);
        td3.setAttribute("data-name", data.drinks[i].strDrink);
        if (strIngredients.length > 0) {
            td3.setAttribute("data-ingred", strIngredients);
        }
        td3.classList.add("p-2");
        td3.addEventListener("click", saveCocktail);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
    }
    searchResultsEl.appendChild(table);
    searchResultsEl.addEventListener("click", displayImage);
}

function displayIngredients(data) {
    console.log("inside displayIngredients");
    console.log(data);
   
    let strIngredient = "";
    let strMeasure = "";   
    let ulEl;
    let liEl;
//console.log(data.drinks[0]["strIngredient" + 1]);
    removeAllChildren(searchImageEl);
    ulEl = document.createElement("ul");
    for (let i = 1; i < 15; i++) {
       // console.log("ingredient = " + data.drinks[0]["strIngredient" + i]);
        if (data.drinks[0]["strIngredient" + i] != null) {
            liEl = document.createElement('li');
            
            if (data.drinks[0]["strMeasure" + i] != null) {
                liEl.innerHTML = data.drinks[0]["strMeasure" + i] + " " + data.drinks[0]["strIngredient" + i];
            } else {
                liEl.innerHTML =  data.drinks[0]["strIngredient" + i];
            }
        } else {
            break;
        }
        console.log(strIngredient);
        ulEl.appendChild(liEl); 
    }
    searchImageEl.appendChild(ulEl);
    /*searchImageEl.style.position = 'relative';
    ulEl.style.position = 'absolute';
    const rect = searchImageEl.getBoundingClientRect();
    ulEl.style.top = rect.top.toFixed() + "px";*/
}

function displayIngredientsNEW(event) {
    console.log("displayIngredients");
    //console.log(data);
   
   // let strIngredient = "";
    //let strMeasure = "";   
    let ulEl;
    let liEl;
    let ingredients

    removeAllChildren(searchImageEl);
    let chosenElement = event.target;
    console.log(chosenElement.getAttribute("data-ingred"));
    if (chosenElement.getAttribute("data-ingred") != "" &&  chosenElement.getAttribute("data-ingred") != null){
        ingredients = chosenElement.getAttribute("data-ingred").split("#");
        console.log(ingredients);
        ulEl = document.createElement("ul");
        for (let i=0; i<ingredients.length; i++) {
            liEl = document.createElement('li');
            liEl.innerHTML = ingredients[i];
            ulEl.appendChild(liEl);
        }

    searchImageEl.appendChild(ulEl);
    } else {
        callAPI("filter", "i", chosenElement.getAttribute("data-id"));
    }
    
    
}

function callAPI(filterType, searchType, searchCriteria) {
    //console.log("searchCriteria = " + searchCriteria);
    let requestUrl;
    //www.thecocktaildb.com/api/json/v1/1/search.php?i=vodka
    //www.thecocktaildb.com/api/json/v1/1/random.php
    //www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007
   if (filterType == "random") {
    requestUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
   } else {
    requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/${filterType}.php?${searchType}=${searchCriteria}`;
   }
   
   console.log('requestUrl = ' + requestUrl);
    fetch(requestUrl) // call API to get lat and lon
        .then(function (response) {
            //convert to JSON
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            //console.log("filterType = " + "|" + filterType + "|");
            if (filterType.trim() == "lookup") {
                console.log("calling displayIngredients");
                displayIngredients(data);
               // return;
            /*} else if (filterType.trim() == "search") {
                console.log("calling displayData");
                displayData(data); */
            } else {
                console.log("calling displayData");
                displayData(data);
                //return ;
            }
                       
       })
        .catch(function(error){
            alert("Error!!"); 
            return null;
        }
        );

}

function isValid(fieldName){
    if (document.getElementById(fieldName)) {
        if (document.getElementById(fieldName).value != "") {
            return true;
        }
        
    }
    return false;
}

function chooseOption(event) {
    
    let chosenValue = event.target.value;
    let nameValue = document.querySelector("#name-fields");
    let ingredientValue = document.querySelector("#ingredient-fields");
    if (chosenValue == "by name") {
        nameValue.classList.remove("hidden");
        ingredientValue.classList.add("hidden"); 
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);       
    } else if (chosenValue == "by ingredient"){
        ingredientValue.classList.remove("hidden");
        nameValue.classList.add("hidden");
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);
    } else if (chosenValue == "random") {
        nameValue.classList.add("hidden");
        ingredientValue.classList.add("hidden");
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);
    }
}

function searchHandler() {
    
    let chosenValue = $("input[name='search-options']:checked").val();
    let searchValue = '';
    let searchType = '';
    let filterType = '';

    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);

    if (chosenValue == "by name"){
       // console.log('searchhandler - name');
        if (!isValid("cocktail-name")){
            alert("Please enter the cocktail name.");
            return;
        }
        searchValue = $("#cocktail-name").val();
        searchType = "s";
        filterType = "search";
        $("#cocktail-name").val("");
    } else if (chosenValue == "by ingredient"){
       // console.log('searchHandler - ingredient');
        if (!isValid("cocktail-ingredient")){
            alert("Please enter the ingredient name.")
            return;
        }
        searchValue = $("#cocktail-ingredient").val();
        searchType = "i";
        $("#cocktail-ingredient").val("");
        filterType = "filter";
    } else {
        filterType = "random";
    }
// XXX
    callAPI(filterType, searchType, searchValue);
    //console.log("returned = " + dataReturned);
    //displayData(dataReturned);
}

function openModal() {
    removeAllChildren(searchResultsEl);
    clearInputFields();
    removeAllChildren(searchImageEl);
    cocktailModalEl.classList.remove("hidden");
    //var cancelEl = document.getElementById("#cancel-button");
    var cancelEl = document.querySelector("#cancel-button");
    cancelEl.addEventListener("click", closeModal);
    //console.log('inside openmodal');
    
    radioEl.addEventListener("click", chooseOption);
    
    //cancelEl.addEventListener("click", closeModal);
}

function closeModal() {
    //alert("close");
    cocktailModalEl.classList.add("hidden");
   // console.log('inside openmodal');
}

function saveCocktail(event) {
    event.stopPropagation();
    let chosenDrink = event.currentTarget;
    let cocktailID = chosenDrink.getAttribute("data-id");
    let cocktailName = chosenDrink.getAttribute("data-name");
    let cocktailImg = chosenDrink.getAttribute("data-img");
    let cocktailIngred = chosenDrink.getAttribute("data-ingred");
    let arrayCocktails;
    let storedCocktails = localStorage.getItem("cocktails");
    searchCriteria = cocktailID;

    if (cocktailIngred != "" && cocktailIngred != null) {
        console.log("got ingredients from data-set");
        let currentCocktail = {
            id: cocktailID,
            name: cocktailName,
            img: cocktailImg,
            ingredients: cocktailIngred
        }  

        //check if first time to store to local storage
        //create blank array and add element
        if (storedCocktails == null){
            console.log("Storing first cocktail");
            arrayCocktails = [currentCocktail];
        } else {
        //already have saved cocktail so update array with new cocktail
        console.log("already have cocktails")
            arrayCocktails = JSON.parse(storedCocktails);
        if (arrayCocktails.filter(e => e.id === cocktailID).length === 0) {
            console.log("Storing - " + cocktailName);
            arrayCocktails.push(currentCocktail);
        }
        }
        console.log("Final storing - " + JSON.stringify(arrayCocktails));
        localStorage.setItem("cocktails", JSON.stringify(arrayCocktails));
    } else {
        console.log("API Call to get ingredients");
        let requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${searchCriteria}`;
        console.log("storing - " + cocktailName);

        fetch(requestUrl) // call API to get lat and lon
            .then(function (response) {
                //convert to JSON
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                cocktailIngred = getAllIngredients(data.drinks[0]);
                let currentCocktail = {
                    id: cocktailID,
                    name: cocktailName,
                    img: cocktailImg,
                    ingredients: cocktailIngred.join("#")
            }  

            //check if first time to store to local storage
            //create blank array and add element
            if (storedCocktails == null){
                console.log("Storing first cocktail");
                arrayCocktails = [currentCocktail];
            } else {
            //already have saved cocktail so update array with new cocktail
            console.log("already have cocktails")
                arrayCocktails = JSON.parse(storedCocktails);
            if (arrayCocktails.filter(e => e.id === cocktailID).length === 0) {
                console.log("Storing - " + cocktailName);
                arrayCocktails.push(currentCocktail);
            }
            }
            console.log("Final storing - " + JSON.stringify(arrayCocktails));
            localStorage.setItem("cocktails", JSON.stringify(arrayCocktails));
                       
       })
        .catch(function(error){
            alert("Error!!"); 
            return null;
        }
        );   
    
    }
    
}

selectCocktailBtnEl.addEventListener("click", openModal);
searchButtonEl.addEventListener("click", searchHandler);
    //btn.addEventListener("click", openModel);
searchResultsEl.addEventListener("click", displayImage);
searchImageEl.addEventListener("click", getIngredients);
localStorage.clear("cocktails");
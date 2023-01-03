
//button variables
let selectCocktailBtnEl = document.querySelector(".cocktail-select");
//console.log(selectCocktailBtnEl);
let cocktailModalEl = document.querySelector("#cocktail-modal");
let searchButtonEl = document.querySelector("#search-button");
let searchResultsEl = document.querySelector("#search-results");
let resultsEl = document.querySelector("#results");
let searchImageEl = document.querySelector("#search-image");
var radioEl = document.querySelector("#radio-buttons");
var closeModalEl = document.querySelector("#close-modal");
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
    //event.stopPropagation();
    console.log("inside getIngredients");
    let chosenImg = event.target;
    console.log(event.target.getAttribute('class'));
    let cocktailID = chosenImg.getAttribute("data-id");
    console.log("getIngredients id " + cocktailID);
    if (cocktailID != null) {
        callAPI("lookup", "i", cocktailID);
    }
    
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

function displayImage(event) {
    //alert('clicked');
    console.log("displayImage");
    let chosenDrink = event.currentTarget;
    console.log(event.currentTarget.getAttribute('class'));
    //event.stopPropagation();
    //const rect = chosenDrink.getBoundingClientRect();
    //alert(rect.top.toFixed());
    
   if (chosenDrink.getAttribute("data-name") == null) {
    return;
   }
    let cocktailName = chosenDrink.getAttribute("data-name");
    let imgValue = chosenDrink.getAttribute("data-img");
    let cocktailID = chosenDrink.getAttribute("data-id");
    let ingredients = chosenDrink.getAttribute("data-ingred");
    //("img = " + imgValue);
    removeAllChildren(searchImageEl);
    let imgEl = document.createElement('img');
    imgEl.setAttribute("src", imgValue);
    imgEl.setAttribute("data-id", cocktailID);
    imgEl.setAttribute("data-ingred", ingredients);
    //imgEl.setAttribute("border-radius", "30%");
    imgEl.classList.add("rounded-b-2xl");
    imgEl.classList.add("cursor-pointer");
    imgEl.setAttribute("data-bs-toggle","tooltip");
    imgEl.setAttribute("title", "Click to see ingredients.");    

    searchImageEl.classList.remove("hidden");
    searchImageEl.classList.add("w-32");
    //searchImageEl.classList.add("w-32");
   searchImageEl.classList.add("mx-auto");
   searchImageEl.classList.add("my-auto");
   searchImageEl.classList.add("cocktail-border");
   searchImageEl.classList.add("p-0");

   let pEl = document.createElement('p');
   pEl.classList.add("text-center");
   pEl.classList.add("text-xs");
   pEl.classList.add("p-2");
   pEl.innerHTML = cocktailName;
   searchImageEl.appendChild(pEl);
   searchImageEl.appendChild(imgEl);
    
   // searchImageEl.scrollIntoView(true);
    //alert(imgEl.offsetTop);
    //imgEl.style.top = rect.top.toFixed() + "px";
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
    let storedCocktails = localStorage.getItem("cocktails");
    console.log("displayData - storedCocktails = " + storedCocktails);
    let arrayCocktails;
    let blAlreadySaved;
    let pEl;
    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);
    pEl = document.getElementById("search-count");
    if (!pEl) {
        
        pEl = document.createElement("p");
        pEl.classList.add("text-sm");
        pEl.classList.add("font-bold");
        pEl.classList.add("block");
        pEl.classList.add("w-full");
        pEl.setAttribute("id", "search-count");
    }
    
    pEl.innerHTML = "Search Results - " + data.drinks.length + " cocktail(s) found";

    var table = document.createElement('table');
    console.log("length = " + data.drinks.length);
    for (var i = 0; i < data.drinks.length; i++){
        blAlreadySaved = false;

        if (storedCocktails != null && storedCocktails != "") {
            arrayCocktails = JSON.parse(storedCocktails);
            if (arrayCocktails.filter(e => e.id === data.drinks[i].idDrink).length !== 0) {
                console.log("already saved - " + data.drinks[i].idDrink);
                blAlreadySaved = true;
            }
        }

        var tr = document.createElement('tr');   

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');

        strIngredients = getAllIngredients(data.drinks[i]).join("#");
        td1.innerHTML ='<i class="fas fa-cocktail"></i>';
        if (strIngredients.length > 0) {
            td1.setAttribute("data-ingred", strIngredients);
        }
        td1.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td1.setAttribute("data-id", data.drinks[i].idDrink);
        td1.setAttribute("data-name", data.drinks[i].strDrink);
        td1.addEventListener("click", displayImage);
       
        td1.classList.add("pr-2");

        if (blAlreadySaved) {
            // td3.innerHTML = '<i class="fa-solid fa-check"></i>';
             td1.classList.add("dark-orange");  
        } 

        td2.classList.add("text-sm");
        td2.innerHTML = data.drinks[i].strDrink;
        td2.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td2.setAttribute("data-id", data.drinks[i].idDrink);
        td2.setAttribute("data-name", data.drinks[i].strDrink);
        
        if (strIngredients.length > 0) {
            td2.setAttribute("data-ingred", strIngredients);
        }
        
       // console.log(getAllIngredients(data.drinks[i]));
        td2.classList.add("hover:bg-gray-300");
        //td2.classList.add("ruby");
        td2.classList.add("rounded-lg");
        td2.classList.add("cursor-pointer");

        td2.setAttribute("data-bs-toggle","tooltip");
        td2.setAttribute("title", "Click to see cocktail ingredients.");
        
        
        
        if (blAlreadySaved){
            td2.classList.add("dark-orange");
        }

       // td2.classList.add("m-3");
       td3.innerHTML = '<i class="fa-solid fa-image"></i>';
       td3.classList.add("cursor-pointer");
        td3.setAttribute("data-bs-toggle","tooltip");
        td3.setAttribute("title", "Click to view cocktail image.");
       if (blAlreadySaved) {
       // td3.innerHTML = '<i class="fa-solid fa-check"></i>';
        td3.classList.add("dark-orange");  
       } 
        

        //<i class="fa-solid fa-check"></i>
        td3.setAttribute("data-img", data.drinks[i].strDrinkThumb);
        td3.setAttribute("data-id", data.drinks[i].idDrink);
        td3.setAttribute("data-name", data.drinks[i].strDrink);
        if (strIngredients.length > 0) {
            td3.setAttribute("data-ingred", strIngredients);
        }
       td3.classList.add("pl-2");
       
        
        
        td3.addEventListener("click", displayImage);

        if (blAlreadySaved) {
            td4.innerHTML = '<i class="fa-solid fa-check"></i>';
            td4.classList.add("dark-orange");  
           } else {
            
            td4.innerHTML = '<i class="far fa-save"></i>';
            td4.classList.add("cursor-pointer");
            td4.setAttribute("data-bs-toggle","tooltip");
            td4.setAttribute("title", "Click to save cocktail.");
           }
            
    
            //<i class="fa-solid fa-check"></i>
            td4.setAttribute("data-img", data.drinks[i].strDrinkThumb);
            td4.setAttribute("data-id", data.drinks[i].idDrink);
            td4.setAttribute("data-name", data.drinks[i].strDrink);
            if (strIngredients.length > 0) {
                td4.setAttribute("data-ingred", strIngredients);
            }
           td4.classList.add("pl-2");
           
            
           td4.addEventListener("click", saveCocktail);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
   
   //create scroll around results
   searchResultsEl.classList.add("h-full");
    searchResultsEl.classList.add("max-h-full");
    searchResultsEl.classList.add("overflow-y-auto");
    //searchResultsEl.classList.add("overflow-scroll");
    
    //overflow-y-auto h-32
    searchResultsEl.classList.add("max-w-full");

    

    //searchResultsEl.appendChild(pEl);
    resultsEl.parentNode.insertBefore(pEl, resultsEl);
    searchResultsEl.appendChild(table);
   // searchResultsEl.addEventListener("click", displayImage);
    searchResultsEl.addEventListener("click", getIngredients);
}

function displayIngredients(data) {
    console.log("inside displayIngredients");
    console.log(data);
   
    let strIngredient = "";
    let strMeasure = "";   
    let ulEl;
    let liEl;
    let divEl;

//console.log(data.drinks[0]["strIngredient" + 1]);

    removeAllChildren(searchImageEl);
    pEl = document.createElement("p");
    pEl.classList.add("text-sm");
    pEl.classList.add("font-bold");
    pEl.innerHTML = data.drinks[0]["strDrink"];
    ulEl = document.createElement("ul");
    ulEl.classList.add("text-sm");
    
    ulEl.classList.add("cadet-blue");
    ulEl.classList.add("list-disc");
    ulEl.classList.add("p-2");
    ulEl.classList.add("pl-4");
    for (let i = 1; i < 15; i++) {
        console.log("ingredient = " + data.drinks[0]["strIngredient" + i]);
        if (data.drinks[0]["strIngredient" + i] != null) {
            liEl = document.createElement('li');
            
            
            if (data.drinks[0]["strMeasure" + i] != null) {
                liEl.innerHTML =  data.drinks[0]["strMeasure" + i] + " " + data.drinks[0]["strIngredient" + i];
            } else {
                liEl.innerHTML =  data.drinks[0]["strIngredient" + i];
            }
        } else {
            break;
        }
        console.log(strIngredient);
        ulEl.appendChild(liEl); 
    }
    divEl = document.createElement("div");
    divEl.classList.add("bg-white");
    divEl.classList.add("rounded-2xl");
    divEl.classList.add("p-2");
    divEl.appendChild(pEl);
    divEl.appendChild(ulEl);
    searchImageEl.appendChild(divEl);
    searchImageEl.classList.remove("hidden");
    //searchImageEl.classList.add("w-32");
    searchImageEl.classList.remove("w-32");
   searchImageEl.classList.add("mx-auto");
   searchImageEl.classList.add("my-auto");
   searchImageEl.classList.add("cocktail-border");
   searchImageEl.classList.add("p-0");
   searchImageEl.classList.add("ml-2");
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
           // console.log("response = " + response);
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
            alert("Sorry nothing matches your search. Please try again."); 
            
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
    //alert('chosenOption');
    let chosenValue = event.target.value;
    let nameValue = document.querySelector("#name-fields");
    let ingredientValue = document.querySelector("#ingredient-fields");
    if (chosenValue == "by name") {
       // alert("name");
        nameValue.classList.remove("hidden");
        ingredientValue.classList.add("hidden"); 
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl); 
        $("#search-count").html("");

    } else if (chosenValue == "by ingredient"){
        ingredientValue.classList.remove("hidden");
        nameValue.classList.add("hidden");
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);
        $("#search-count").html("");
    } else if (chosenValue == "random") {
        //alert("random");
        nameValue.classList.add("hidden");
        ingredientValue.classList.add("hidden");
        removeAllChildren(searchImageEl);
        removeAllChildren(searchResultsEl);
        $("#search-count").html("");
    } else {
        return;
    }
    searchResultsEl.classList.add("hidden");
    searchImageEl.classList.add("hidden");
}

function searchHandler() {
    
    let chosenValue = $("input[name='search-options']:checked").val();
   
    let searchValue = '';
    let searchType = '';
    let filterType = '';

    removeAllChildren(searchImageEl);
    removeAllChildren(searchResultsEl);
    searchImageEl.classList.remove("cocktail-border");
    
    if (typeof chosenValue == "undefined") {
        alert("Please select to search by cocktail name, cocktail ingredient or choose a random cocktail.");
        return;
    }
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
    $('input[name="search-options"]').attr('checked', false);
    $('#name-fields').addClass("hidden");
    $('#ingredient-fields').addClass("hidden");
    //cancelEl.addEventListener("click", closeModal);
}

function closeModal() {
    //alert("close");
    cocktailModalEl.classList.add("hidden");
    searchResultsEl.classList.add("hidden");
    searchImageEl.classList.add("hidden");
    $("#search-count").html("");
    $("#search-count").remove();
   // console.log('inside openmodal');
}

function saveCocktail(event) {
    event.stopPropagation();
    let chosenDrink = event.currentTarget;
    console.log(event.target.getAttribute('class'));
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


            $(`td[data-id='${cocktailID}']`).addClass("dark-orange");   
            chosenDrink.innerHTML = "<i class='fa-solid fa-check'></i>";
            //$(`td[data-id='${cocktailID}']`).addClass("font-bold"); 
             

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
            $(`td[data-id='${cocktailID}']`).addClass("dark-orange");   
            chosenDrink.innerHTML = "<i class='fa-solid fa-check'></i>";
            //$(`td[data-id='${cocktailID}']`).addClass("font-bold");  
       })
        .catch(function(error){
            alert("Error!!"); 
            return null;
        }
        );   
    
    }
    
}

/*
Whisky Sour
Daiquiri
Manhattan
Dry Martini
Espresso Martini
Margarita
Aperol Spritz
Moscow Mule
*/

$(function () {
    var cocktailNames = [
      'Cosmopolitan',
      'Mojito',
      'Mai Tai',
      'Mint Julep',
      'Margarita',
      'Caipirinha',
      'Pina Colada',
      'Old Fashioned',
      'Negroni',
      'Whiskey Sour',
      'Daiquiri',
      'Manhattan',
      'Dry Martini',
      'Espresso Martini',
      'Aperol Spritz',
    ];
    $('#cocktail-name').autocomplete({
      source: cocktailNames,
    });

    var cocktailIngred = [
        'Vodka',
        'Gin',
        'Whiskey',
        'White Rum',
        'Dark Rum',
        'Syrup',
        'Lime',
        'Orange',
        'Soda Water',
        'Bourbon',
        'Baileys Irish Cream',
        'Amaretto'
      ];
      $('#cocktail-ingredient').autocomplete({
        source: cocktailIngred,
      });

      selectCocktailBtnEl.addEventListener("click", openModal);
      searchButtonEl.addEventListener("click", searchHandler);
    //btn.addEventListener("click", openModel);
      //searchResultsEl.addEventListener("click", displayImage);
      //searchResultsEl.addEventListener("click", getIngredients);
      //searchImageEl.addEventListener("click", getIngredients);
     // searchImageEl.addEventListener("click", displayImage);
      closeModalEl.addEventListener("click", closeModal);

  });


//localStorage.clear("cocktails");
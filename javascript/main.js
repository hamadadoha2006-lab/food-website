// side-bar
let isOpen = false;
const side = document.getElementById("side-container");
const icon = document.getElementById("icon");
toggleBtn.onclick = function () {
    if (isOpen) {
        side.classList.add("closed");
        icon.classList.remove("fa-xmark"); 
        icon.classList.add("fa-bars"); 
    } else {
        side.classList.remove("closed");
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    }
    isOpen = !isOpen;
}
// ========================================================================================================================
// loader
function showLoader() {
    document.getElementById("loading").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loading").style.display = "none";
}
// =========================================================================================================================
const searchBtn=document.getElementById("Search");
const CategoriesBtn=document.getElementById("Categories");
const AreaBtn=document.getElementById("Area");
const IngredientsBtn=document.getElementById("Ingredients");
const contactBtn=document.getElementById("Contact");
// ==========================================================================================================================
// search
searchBtn.addEventListener("click", function searchInfo() {
    const searchRow = document.getElementById("rowData");
    searchRow.innerHTML = `
        <div class="col-md-6">
            <input id="searchByName" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input id="searchByFirstLetter" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
        <div id="searchResults" class="row g-3 mt-3"></div>
    `;
    const searchName = document.getElementById("searchByName");
    const searchFirstLetter = document.getElementById("searchByFirstLetter");

    searchName.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        if (value) searchByName(value);
        else document.getElementById("searchResults").innerHTML = "";
    });

    searchFirstLetter.addEventListener("input", (e) => {
        const value = e.target.value.trim();
        if (value) searchByFLetter(value);
        else document.getElementById("searchResults").innerHTML = "";
    });
});

async function searchByName(name) {
    showLoader()
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`);
    const result = await response.json();
    displaySearchResults(result.meals);
    hideLoader()
}

async function searchByFLetter(letter) {
    showLoader()
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${encodeURIComponent(letter)}`);
    const result = await response.json();
    displaySearchResults(result.meals);
    hideLoader()
}

function displaySearchResults(meals) {
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";

    if (!meals) {
        searchResults.innerHTML = `<p class="text-white">No results found.</p>`;
        return;
    }

    meals.forEach(meal => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3 mb-3";

        col.innerHTML = `
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        `;
        searchResults.appendChild(col);
    });
}
// ============================================================================================================================
// category
CategoriesBtn.addEventListener("click", async function getCategory() {
    showLoader()
    const cat = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const res = await cat.json();
    displayCategory(res.categories);
    hideLoader()
});
function displayCategory(categories) {
    const rowCategory = document.getElementById("rowData");
    rowCategory.innerHTML = "";
    categories.forEach(category => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3 mb-3";

        col.innerHTML = `
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.slice(0, 135)}...</p>
                </div>
            </div>
        `;
        rowCategory.appendChild(col);
    });
}
getCategoryMeals("chicken");
async function getCategoryMeals(categoryName) {
    showLoader()
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryName)}`);
        const result = await response.json();
        displayMeals(result.meals);
        hideLoader() 
}
function displayMeals(meals) {
    const row = document.getElementById("rowData");
    row.innerHTML = ""; 
    meals.forEach(meal => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3 mb-3";

        col.innerHTML = `
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        `;

        row.appendChild(col);
    });
}
// ======================================================================================================================================
// meals details
async function getMealDetails(mealID) {
    showLoader()
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const result = await response.json();
    displayMealDetails(result.meals[0]);
    hideLoader() 
}
function displayMealDetails(meal) {
    const mealDetails = document.getElementById("rowData");
    mealDetails.innerHTML = "";
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`;
        }
    }
    let tags = "";
    if (meal.strTags) {
        meal.strTags.split(",").forEach(tag => {
            tags += `<li class="alert alert-warning m-2 p-1">${tag}</li>`;
        });
    }

    mealDetails.innerHTML = `
        <div class="col-md-4 text-white">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
        </div>

        <div class="col-md-8 text-white">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>

            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>

            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>

            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
            </ul>

            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    `;
}
// ====================================================================================================================
// area
AreaBtn.addEventListener("click", async function getArea() {
    showLoader()
    const area = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    const res = await area.json();
    displayArea(res.meals);
    hideLoader()
})
function displayArea(areas) {
    const areaRow = document.getElementById("rowData");
    areaRow.innerHTML="";
    areas.forEach(area => {
        const areaName = area.strArea;
        areaRow.innerHTML += `
            <div class="col-md-6 col-lg-3 mb-3">
                <div onclick="getAreaMeal('${areaName}')" 
                     class="rounded-2 text-center cursor-pointer text-white p-3">
                    <i class="fa-solid fa-house-laptop fa-4x pb-2"></i>
                    <h3>${areaName}</h3>
                </div>
            </div>
        `;
    });
}
async function getAreaMeal(areaName) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(areaName)}`);
    const result = await response.json();
    displayAreaMeals(result.meals);
}

function displayAreaMeals(meals) {
    const areaMeals = document.getElementById("rowData");
    areaMeals.innerHTML = "";

    meals.forEach(meal => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3 mb-3";

        col.innerHTML = `
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        `;

        areaMeals.appendChild(col);
    });
}
// =================================================================================================================
// ingredient
IngredientsBtn.addEventListener("click", async function getIngredient() {
    showLoader()
    const Ingredients = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    const res = await Ingredients.json();
    displayIngredient(res.meals);
    hideLoader()
});
function displayIngredient(ingredients) {
    const ingredientRow = document.getElementById("rowData");
    ingredientRow.innerHTML = "";

    ingredients.forEach(ingredient => {
        const name = ingredient.strIngredient;
        const description = ingredient.strDescription ? ingredient.strDescription.substring(0, 100) : "";

        ingredientRow.innerHTML += `
            <div class="col-md-6 col-lg-3 mb-3 text-white">
                <div onclick="getIngredientMeal('${name}')" class="rounded-2 text-center cursor-pointer p-3">
                    <i class="fa-solid fa-drumstick-bite fa-4x pb-2"></i>
                    <h3>${name}</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;
    });
}
async function getIngredientMeal(ingredientName) {
    showLoader()
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredientName)}`);
    const result = await response.json();
    displayIngredientMeal(result.meals);
    hideLoader()
}
function displayIngredientMeal(meals) {
    const ingredientMeal = document.getElementById("rowData");
    ingredientMeal.innerHTML = "";

    meals.forEach(meal => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-3 mb-3";

        col.innerHTML = `
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        `;

        ingredientMeal.appendChild(col);
    });
}
// ====================================================================================================================================
// contact
contactBtn.addEventListener("click", function contactInfo() {

    const contactRow = document.getElementById("rowData");
    contactRow.innerHTML = "";

    contactRow.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">

                    <div class="col-md-6">
                        <input id="nameInput" oninput="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>

                    <div class="col-md-6">
                        <input id="emailInput" oninput="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *example@yyy.zzz
                        </div>
                    </div>

                    <div class="col-md-6">
                        <input id="phoneInput" oninput="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>

                    <div class="col-md-6">
                        <input id="ageInput" oninput="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>

                    <div class="col-md-6">
                        <input id="passwordInput" oninput="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Password must be at least 8 characters with letters and numbers
                        </div>
                    </div>

                    <div class="col-md-6">
                        <input id="repasswordInput" oninput="inputsValidation()" type="password" class="form-control" placeholder="Re-enter Password">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Password doesn't match
                        </div>
                    </div>

                </div>

                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>
    `;
});
// ===================================================================================================================
// validation
function inputsValidation() {
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const phoneInput = document.getElementById("phoneInput");
    const ageInput = document.getElementById("ageInput");
    const passwordInput = document.getElementById("passwordInput");
    const repasswordInput = document.getElementById("repasswordInput");
    const submitBtn = document.getElementById("submitBtn");
    const nameRegex = /^[A-Za-z ]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    let isValid = true;
        if (nameRegex.test(nameInput.value)) {
        nameInput.classList.add("is-valid");
        nameInput.classList.remove("is-invalid");
    } else {
        nameInput.classList.add("is-invalid");
        nameInput.classList.remove("is-valid");
        isValid = false;
    }
    if (emailRegex.test(emailInput.value)) {
        emailInput.classList.add("is-valid");
        emailInput.classList.remove("is-invalid");
    } else {
        emailInput.classList.add("is-invalid");
        emailInput.classList.remove("is-valid");
        isValid = false;
    }
    if (phoneRegex.test(phoneInput.value)) {
        phoneInput.classList.add("is-valid");
        phoneInput.classList.remove("is-invalid");
    } else {
        phoneInput.classList.add("is-invalid");
        phoneInput.classList.remove("is-valid");
        isValid = false;
    }
    if (ageInput.value >= 18 && ageInput.value <= 65) {
        ageInput.classList.add("is-valid");
        ageInput.classList.remove("is-invalid");
    } else {
        ageInput.classList.add("is-invalid");
        ageInput.classList.remove("is-valid");
        isValid = false;
    }
    if (passwordRegex.test(passwordInput.value)) {
        passwordInput.classList.add("is-valid");
        passwordInput.classList.remove("is-invalid");
    } else {
        passwordInput.classList.add("is-invalid");
        passwordInput.classList.remove("is-valid");
        isValid = false;
    }
    if (repasswordInput.value === passwordInput.value && passwordInput.value !== "") {
        repasswordInput.classList.add("is-valid");
        repasswordInput.classList.remove("is-invalid");
    } else {
        repasswordInput.classList.add("is-invalid");
        repasswordInput.classList.remove("is-valid");
        isValid = false;
    }
    submitBtn.disabled = !isValid;
}
const form = document.getElementById("form");
const cityInput = document.querySelector(".search-input");
const cityName = document.querySelector("info-title");
const cardContainer = document.querySelector(".card-container");
const waitMsg = document.querySelector(".wait");

let cities = JSON.parse(localStorage.getItem("cities")) || [];

const saveLocalStorage = (citiesList) => {
  localStorage.setItem("cities", JSON.stringify(citiesList));
};

const convertCelsius = (kelvin) => {
    celsius = Math.round(kelvin - 273.15);
    return celsius;
};

const renderCity = (city) => {
    const imageName = city.weather[0].icon; //ej: "icon": "10d"

    return `
    <div class="card-clima animate">
    <i class="fa-solid fa-x close" data-id='${city.id}'></i>
    <div class="clima-info">
              <h2 class="info-title">${city.name}</h2>
              <p class="info-subtitle">${city.weather[0].description}</p>
              <div class="info-temp">
                <span class="temp">${convertCelsius(city.main.temp)}°</span>
                <span class="st">${convertCelsius(
                  city.main.feels_like
                )}° ST</span>
              </div>
            </div>
            <div class="clima-img">
            <img src="./assets/img/${imageName}.png" alt=""/>
            </div>
            <div class="clima-temp">
              <div class="clima-max-min">
                <span class="clima-max"
                  ><i class="fa-solid fa-arrow-up-long"></i>Max: ${convertCelsius(
                    city.main.temp_max
                  )}</span
                >
                <span class="clima-min"
                  ><i class="fa-solid fa-arrow-down-long"></i>Min: ${convertCelsius(
                    city.main.temp_min
                  )}</span>
         </div>
       <span class="clima-humedad">${city.main.humidity}% Humedad</span>
    </div>
    </div>
    `;
};

const renderCitiesList = (citiesList) => {
    cardContainer.innerHTML = citiesList.map((city) => renderCity(city)).join("");
};

const hideWaitMsg = (citiesList) => {
    if (citiesList.length) {
      waitMsg.classList.add("hidden");
      return;
    }
    waitMsg.classList.remove("hidden");
};


const searchCity = async (e) => {
    e.preventDefault();
  
    const searchedCity = cityInput.value.trim();
  
    if (searchedCity === "") {
      alert("Por favor ingrese una ciudad");
      return;
    }
    const fetchedCity = await requestCity(searchedCity);
  
    if (!fetchedCity.id) {
      alert("La ciudad ingresada no existe.");
      form.reset();
      return;
    } else if (cities.some((city) => city.id === fetchedCity.id)) {
      alert("Ya estamos mostrando el clima de esa ciudad");
      form.reset();
      return;
    }

    cities = [fetchedCity, ...cities];
    renderCitiesList(cities);
    saveLocalStorage(cities);
    hideWaitMsg(cities);
    form.reset();

};

const removeCity = (e) => {
    if (!e.target.classList.contains("close")) return console.log("asd");
    const filterId = Number(e.target.dataset.id);
    if (window.confirm("Esta seguro que desea eliminar esta card de clima?")) {
      cities = cities.filter((city) => city.id !== filterId);
      renderCitiesList(cities);
      saveLocalStorage(cities);
      hideWaitMsg(cities);
    }
};

const init = () => {
    renderCitiesList(cities);
    hideWaitMsg(cities);
    form.addEventListener("submit", searchCity);
    cardContainer.addEventListener("click", removeCity);
};
init();
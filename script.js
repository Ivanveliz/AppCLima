const result = document.querySelector(".result");
const form = document.querySelector(".get-weather");
const nameCity = document.querySelector("#city");
const nameCountry = document.querySelector("#country");
const selectElement = document.querySelector("#country")

//este domContentLoader cargar los paises antes se cargue todo para que el usuario pueda elegir

document.addEventListener("DOMContentLoaded", function() {
    callToApiCountries(); // Llama a la función para obtener los países y llenar el select
});


function callToApiCountries (){
    const URLCountries = `https://restcountries.com/v3.1/all`
    
    fetch(URLCountries)
        .then(data =>{
            return data.json()
        })  
        .then(dataJSON => {
            // console.log(dataJSON)
            showElement(dataJSON)
        })  

    }

    function showElement(data){
        //el .sort ordena los paises por orden alfabético
        data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        data.forEach(country => {
            const option = document.createElement("option")
            option.value = country.name.common 
            option.textContent = country.name.common
            selectElement.appendChild(option)
        });
    }

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (nameCity.value === "" || nameCountry.value === "") {
    showError("Ambos campos son obligatorios");
    return
  }
callToApiCountries()
callToApi(nameCity.value, nameCountry.value)
});



//llamada de la api para la busqueda del clima.
function callToApi(city, country){
    const apiId = '84ad1eb9030f708b21f7bcc2c82e3fec'

    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`
fetch(URL)
    .then(data => {
        return data.json()
       
    })
    .then(dataJSON => {
        if(dataJSON.cod === '404'){
            showError('La cuidad no fue encontrada')
        }    
        console.log(dataJSON)
        clean()
        showWeather(dataJSON)
    })
    .catch(error =>{
       
        console.log(error)
        
    })
}


function showWeather(data){
const {name, main:{temp_min, temp_max,temp}, weather:[arr] } = data

const degreesTemp = kelvinToCentigrade(temp)
const degreesTempMax = kelvinToCentigrade(temp_max)
const degreesTempMin = kelvinToCentigrade(temp_min)

const content = document.createElement('div')
content.innerHTML = `
<h5>Clima en ${name}</h5>
<img src=https://openweathermap.org/img/wn/${arr.icon}@2x.png alt="icon">
<h2>${degreesTemp}</h2>
<p>Max: ${degreesTempMax}</p>
<p>Min: ${degreesTempMin}</p>
`
result.appendChild(content)

// console.log(name)
// console.log(temp)
// console.log(temp_min)
// console.log(temp_max)
// console.log(arr.icon)

}
function showError(message) {
    console.log(message)
  const alert = document.createElement("p");
  alert.classList.add("alert-message");
  alert.innerHTML = message;

  form.appendChild(alert);
  setTimeout(() => {
    alert.remove()
  }, 3000)
}

function kelvinToCentigrade(temp) {
    return parseInt(temp - 273.15)
    
}

function clean(){
    result.innerHTML = ''
}
"use strict";

// Atrapando elementos html
const searchBtn = document.getElementById("search-btn");
console.log(searchBtn);
const errorMessage = document.getElementById("error-message");
const loadingMsg = document.getElementById("loading-msg");
const pokeName = document.getElementById("poke-name");
const pokeHistorial = document.getElementById("historial");
const clearPokeHistorial = document.getElementById('clear-historial');
const pokeDisplayData = document.getElementById("poke-display-data");
//
window.addEventListener("DOMContentLoaded", function () {
  const historialPokemon = localStorage.getItem("historial");
  console.log(historialPokemon);
  pokeHistorial.innerHTML = historialPokemon;
});
// 
function clearHistorialFn(){
  localStorage.clear();
  pokeHistorial.innerHTML = '';
}

clearPokeHistorial.addEventListener('click', clearHistorialFn);

function onPokemonDisplayData(pokemon){
  const {order, name} = pokemon;
  console.log(order, name);
  pokeDisplayData.classList.remove("message");
    pokeDisplayData.innerHTML = `
    <p>El numero del pokemon es: ${pokemon.order}</p>
    <p>El nombre del pokemon es: ${pokemon.name}</p>
    `;
}

async function btnSearch() {
  // Datos
  const valor = pokeName.value;
  

  loadingMsg.classList.remove("message");

  try {
    pokeDisplayData.classList.add("message");
    //   Validando que dato no sea numero
    if (Number(valor)) {
      const error = "Ingrese el nombre del pokemon";
      throw new Error(error);
    }
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + valor);
    // Validando que pokemon exista
    if (response.status === 404) {
      throw new Error("Pokemon no encontrado");
    }
    const json = await response.json();
    console.log(json);
    
    onPokemonDisplayData(json);

    pokeHistorial.innerHTML += `
    <li> ${json.name}</li>
`;
    localStorage.setItem("historial", pokeHistorial.innerHTML);

    const jsonCambiado = JSON.stringify(json);
  } catch (error) {
    console.error(error);
    errorMessage.innerText = error;
  } finally {
    loadingMsg.classList.add("message");
    setTimeout(function () {
      errorMessage.innerText = "";
      pokeName.value = "";
      pokeName.focus();
    }, 3000);
  }
}

searchBtn.addEventListener("click", btnSearch);

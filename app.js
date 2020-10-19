// shorten console.log
const log = (param)=> console.log(param);

// selectors
const currentPokemon = document.querySelector('.current-poke');
const ul = document.querySelector('ul');

// events
window.addEventListener('DOMContentLoaded', ()=>{
    ul.addEventListener('click', selectPokemon);
});

let pokeAPI = {
    url: 'https://pokeapi.co/api/v2/',
    type: 'pokemon',
    name: 'umbreon'
}

let speciesAPI = {
    type: 'pokemon-species'
}

// deconstruct pokeAPI for readability
let {url,type,name} = pokeAPI;

// default loads Umbreon data 
const POKEMON = fetch(`${url}${type}/${name}`);
const SPECIES = fetch(`${url}${speciesAPI.type}/${name}`);

// get 151 pokemon names
let POKELIST = fetch('https://pokeapi.co/api/v2/pokemon?limit=151');

Promise.all([POKEMON,SPECIES,POKELIST])
    .then(responses =>{
        return Promise.all(responses.map(response => response.json()));
    })
    .then(data =>{
        // parse response data to appropriate functions
        // 1st is pokemon, 2nd is species, 3rd is list limit
        return displayPokemon(data[0]), flavorText(data[1]), displayList(data[2]);
    })
    .catch(error => {
        log(error)
        alert('check spelling');
    });

// adds pokemon: name, id, image, type, height and weight
// to current pokemon section in html. 
const displayPokemon = (data) => {
    const html = `
        <div class="pokeTitle">
            <h2 class="pokeName">#${data.id} ${data.name}</h2>
        </div>
        <img src=${data.sprites.front_default}>
        <div><span class="poke-type">Type: ${data.types[0].type.name}</span></div>
        <div class="details">
          <span>Height: ${data.height/10} (m)</span>
          <span>Weight: ${data.weight/10} (kg)</span>
        </div>
    `;
    currentPokemon.innerHTML = html;
}

// adds pokemon description and habitat from species API to html
const flavorText = (data) => {
    const div = document.createElement('div');
    div.classList.add('description');
    div.innerHTML = `
        <br>
        <p>Description: ${data.flavor_text_entries[10].flavor_text}</p>
        <br>
        <p>Habitat: ${data.habitat.name}</p>
    `;
    currentPokemon.appendChild(div);
}

// store list of pokemon as a collection of li and append to ul
const displayList = (data) => {
    let results = data.results;
    results.forEach(result => {
        const li = document.createElement('li');
        li.innerText = `${result.name}`;
        ul.appendChild(li);
    });
}

const searchPokedex = () => {
    const input = document.querySelector('#search').value;
    getPokemon(input);
}

// handles user picking pokemon from displayed list of 151 pokemon
const selectPokemon = (event) => {
    const selection = event.target;
    getPokemon(selection.innerText);
}

// fetches and updates current pokemon displayed data  
const getPokemon = (name) => {
    pokeAPI.name = name.trim().toLowerCase();
    const pokemon = fetch(`${url}${type}/${pokeAPI.name}`);
    const species = fetch(`${url}${speciesAPI.type}/${pokeAPI.name}`);
    Promise.all([pokemon,species])
    .then(responses =>{
        return Promise.all(responses.map(response => response.json()));
    })
    .then(data =>{
        return displayPokemon(data[0]), flavorText(data[1]);
    })
    .catch(error => {
        log(error)
        alert('check spelling');
    });
}
const contain = document.getElementById("contain");
const URL = "https://pokeapi.co/api/v2/pokemon/";

const getEvolutions = async (number) => {
    const response = await fetch(URL + number);
    try {
        const data = await response.json();
        const dataSpecies = await fetch(data.species.url);
        const species = await dataSpecies.json();
        const dataEvolutionChain = await fetch(species.evolution_chain.url);
        const evolutionChain = await dataEvolutionChain.json();
        const evolution = evolutionChain.chain;
        const evolutionsNames = [];
        evolutionsNames.push(evolution.species.name);
        evolutionsNames.push(evolution.evolves_to[0].species.name);
        evolutionsNames.push(evolution.evolves_to[0].evolves_to[0].species.name);
        return evolutionsNames;
    } catch (error) {
        console.log(error);
    }
}
const getPokemon = async (name) => {
    const response = await fetch(URL + name);
    try {
        const data = await response.json();
        const pokemon = {
            name: data.name,
            number: data.id,
            image: data.sprites.other["official-artwork"].front_default,
            type: data.types.map((type) => type.type.name),
            height: data.height,
            weight: data.weight,
            stats: {
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                "special-attack": data.stats[3].base_stat,
                "special-defense": data.stats[4].base_stat,
                speed: data.stats[5].base_stat,
            },
            abilities: data.abilities.map((ability) => ability.ability.name),
            evolutions: await getEvolutions(data.id),
        };
        return pokemon;
    } catch (error) {
        console.log(error);
    }
};

function main(Name) {
    const pokemon = getPokemon(Name);
    pokemon.then((pokemon) => {
        if (pokemon) {
            const pokemonImageDiv = document.createElement("div");
            pokemonImageDiv.classList.add("pokemon__image");
            const pokemonImage = document.createElement("img");
            const pokemonInfoDiv = document.createElement("div");
            pokemonInfoDiv.classList.add("pokemon__info");
            const pokemonName= document.createElement("h2");
            const pokemonNumber = document.createElement("p");
            const pokemonWeight = document.createElement("p");
            const pokemonHeight = document.createElement("p");
            const pokemonStatsDiv = document.createElement("div");
            pokemonStatsDiv.classList.add("pokemon__stats");
            const pokemonAbilitiesDiv = document.createElement("div");
            pokemonAbilitiesDiv.classList.add("pokemon__abilities");
            const pokemonEvolutionsDiv = document.createElement("div");
            pokemonEvolutionsDiv.classList.add("pokemon__evolutions");
            const pokemonEvolutionsH2 = document.createElement("h2");
            pokemonEvolutionsH2.textContent = "Evolutions";
            pokemonImage.src = pokemon.image;
            pokemonImageDiv.appendChild(pokemonImage);
            pokemonName.textContent = pokemon.name;
            pokemonInfoDiv.appendChild(pokemonName);
            pokemonNumber.textContent = `#${pokemon.number.toString().padStart(5, "0")}`;
            pokemonInfoDiv.appendChild(pokemonNumber);
            pokemon.type.forEach((type) => {
                const pokemonType = document.createElement("p");
                pokemonType.textContent = type;
                pokemonInfoDiv.appendChild(pokemonType);
            });
            pokemonHeight.textContent = `Height: ${pokemon.height/10} m`;
            pokemonInfoDiv.appendChild(pokemonHeight);
            pokemonWeight.textContent = `Weight: ${pokemon.weight/10} kg`;
            pokemonInfoDiv.appendChild(pokemonWeight);
            for (const stat in pokemon.stats) {
                const pokemonStatDiv = document.createElement("div");
                pokemonStatDiv.classList.add("pokemon__stat");
                const pokemonStat = document.createElement("p");
                pokemonStat.textContent = stat.replace("-", " ");
                pokemonStatDiv.appendChild(pokemonStat);
                pokemonStatsDiv.appendChild(pokemonStatDiv);
                const pokemonStatValue = document.createElement("p");
                pokemonStatValue.textContent = pokemon.stats[stat];
                pokemonStatDiv.appendChild(pokemonStatValue);
            }
            const pokemonAbilitiesH2 = document.createElement("h2");
            pokemonAbilitiesH2.textContent = "Abilities";
            pokemonAbilitiesDiv.appendChild(pokemonAbilitiesH2);
            pokemon.abilities.forEach((ability) => {
                const pokemonAbility = document.createElement("p");
                pokemonAbility.textContent = ability;
                pokemonAbilitiesDiv.appendChild(pokemonAbility);
            });
            const evolutions = pokemon.evolutions;
            console.log(evolutions);
            pokemon.evolutions.forEach((evolution) => {
                getPokemon(evolution).then((pokemon) => {
                    console.log(pokemon);
                    const pokemonEvolution = document.createElement("div");
                    pokemonEvolution.classList.add("pokemon__evolution");
                    const pokemonEvolutionImage = document.createElement("img");
                    pokemonEvolutionImage.src = pokemon.image;
                    pokemonEvolution.appendChild(pokemonEvolutionImage);
                    const pokemonEvolutionName = document.createElement("p");
                    pokemonEvolutionName.textContent = pokemon.name;
                    pokemonEvolution.appendChild(pokemonEvolutionName);
                    pokemonEvolutionsDiv.appendChild(pokemonEvolution);
                });
            });

            
        
        
            contain.appendChild(pokemonImageDiv);
            contain.appendChild(pokemonInfoDiv);
            contain.appendChild(pokemonStatsDiv);
            contain.appendChild(pokemonAbilitiesDiv);
            contain.appendChild(pokemonEvolutionsH2);
            contain.appendChild(pokemonEvolutionsDiv);
        } else {
            const pokemonNotFound = document.createElement("p");
            pokemonNotFound.textContent = "Pokemon not found";
            contain.appendChild(pokemonNotFound);
        }
    });
}

const search = document.getElementById("search");
const searchButton = document.getElementById("btn");
searchButton.addEventListener("click", () => {
    contain.textContent = "";
    let pokemonName = search.value.toLowerCase();
    main(pokemonName);
});


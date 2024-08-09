import React from 'react';
import ReactDOM from 'react-dom';
import './App.css'; 

const pokemonCount = 152;

function PokemonApp() {
  const [pokedex, setPokedex] = React.useState({});
  const [selectedPokemon, setSelectedPokemon] = React.useState(1);

  React.useEffect(() => {
    const fetchAllPokemon = async () => {
      const newPokedex = {};
      for (let i = 1; i <= pokemonCount; i++) {
        await getPokemon(i, newPokedex);
      }
      setPokedex(newPokedex);
    };

    fetchAllPokemon();
  }, []);

  const getPokemon = async (index, newPokedex) => {
    let url = "https://pokeapi.co/api/v2/pokemon/" + index.toString();
    let result = await fetch(url);
    let poke = await result.json();
    
    let pokeName = poke.name;
    let pokeType = poke.types;
    let pokeImg = poke.sprites.front_shiny;
    let pokeCries = poke.cries.latest;

    result = await fetch(poke.species.url);
    let pokeinfo = await result.json();
    pokeinfo = pokeinfo.flavor_text_entries[6].flavor_text;

    newPokedex[index] = { name: pokeName, img: pokeImg, types: pokeType, info: pokeinfo, cries: pokeCries };
  };

  const updatePokemon = (id) => {
    setSelectedPokemon(id);
  };

  const playSound = () => {
    if (pokedex[selectedPokemon] && pokedex[selectedPokemon].cries) {
      const audio = new Audio(pokedex[selectedPokemon].cries);
      audio.play();
    }
  };

  return React.createElement('div', null, 
    React.createElement('div', { id: 'title-box' }, 'Pokedex'),
    React.createElement('div', { id: 'content-box' },
      React.createElement('div', { id: 'pokemon-roster' },
        Object.keys(pokedex).map(id => 
          React.createElement('div', {
            key: id,
            className: 'pokemon-name',
            onClick: () => updatePokemon(Number(id))
          }, `${id}. ${pokedex[id].name.toUpperCase()}`)
        )
      ),
      React.createElement('div', { id: 'pokemon-info' },
        pokedex[selectedPokemon] && React.createElement('div', null,
          React.createElement('img', {
            src: pokedex[selectedPokemon].img,
            alt: pokedex[selectedPokemon].name
          }),
          React.createElement('div', { id: 'pokemon-types' },
            pokedex[selectedPokemon].types.map((type, index) => 
              React.createElement('span', {
                key: index,
                className: `type-box ${type.type.name}`
              }, type.type.name.toUpperCase())
            )
          ),
          React.createElement('div', { id: 'pokemon-description' },
            pokedex[selectedPokemon].info
          ),
          React.createElement('button', { id: 'play-sound-button', onClick: playSound }, 'Play Sound')
        )
      )
    )
  );
}

ReactDOM.render(
  React.createElement(PokemonApp),
  document.getElementById('root')
);

export default PokemonApp;
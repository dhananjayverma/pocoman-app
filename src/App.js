
import axios from "axios";
import { useEffect, useState } from "react";

// Customizing styles
import "./styles.css";

const App = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [pokemonData, setPokemonData] = useState([]);
  const [requestUrl, setRequestUrl] = useState({
    url: {
      prev: null,
      next: null,
      initial: "https://pokeapi.co/api/v2/pokemon" // Initial Api
    }
  });

  // Pokemon request and response processing
  const loadPokemonData = async (operation) => {
    const { url } = requestUrl;
    const pokemonUrl =
      operation === "initial"
        ? url.initial
        : operation === "next"
        ? url.next
        : url.prev;
    const response = await axios.get(pokemonUrl);
    url.next = response.data.next;
    url.prev = response.data.previous;
    setRequestUrl({ url });
    const result = await response.data.results;
    const urls = result.map((res) => axios.get(res.url));
    const pokemonData = await (await axios.all(urls)).map((uRes) => uRes.data);
    setPokemonData(pokemonData);
  };

  useEffect(() => {
    loadPokemonData("initial");
  }, []);

  // Processing the background color based on the pokemon type
  const getBackColor = (poke) => {
    let backColor = "#EEE8AA"; // Default background color
    const pokeTypes = poke.types.map((i) => i.type.name);
    // Update background color based on pokemon type
    if (pokeTypes.includes("fire")) {
      backColor = "#FEC5BB";
    } else if (pokeTypes.includes("grass")) {
      backColor = "#80FFDB";
    } else if (pokeTypes.includes("water")) {
      backColor = "#DFE7FD";
    } else if (pokeTypes.includes("bug")) {
      backColor = "#B0DEA3";
    } else if (pokeTypes.includes("normal")) {
      backColor = "#E0FFFF";
    } else if (pokeTypes.includes("electric")) {
      backColor = "#D8E2DC";
    } else if (pokeTypes.includes("ground")) {
      backColor = "#FAD2E1";
    } else if (pokeTypes.includes("fairy")) {
      backColor = "#FFF1E6";
    } else if (pokeTypes.includes("ghost")) {
      backColor = "#F8EDEB";
    } else if (pokeTypes.includes("fighting")) {
      backColor = "#F1FAEE";
    } else if (pokeTypes.includes("rock")) {
      backColor = "#A8DADC";
    }
    return backColor;
  };

  // Converting the pokemon name first letter uppercase
  const getPokeName = (name) =>
    name.slice(0, 1).toUpperCase() + name.slice(1, name.length);

  // Forming the pokeman id to display
  const getPokeId = (id) => {
    if (id < 10) return `#00${id}`;
    if (id < 100 && id >= 10) return `#0${id}`;
    if (id >= 100) return `#${id}`;
  };

  // Method to process the pokemon state values
  const MIN = 0,
    MAX = 200;
  const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

  const { url } = requestUrl;
  return (
    <>
      {/* Pokemon Title */}
      <h1 className="title">Pokemon App</h1>
      {/* Navigation Buttons */}
      <div className="button-group">
        <button
          className="btn"
          disabled={url.prev === null}
          onClick={() => loadPokemonData("prev")}
        >
          Prev
        </button>
        <button
          className="btn"
          disabled={url.next === null}
          onClick={() => loadPokemonData("next")}
        >
          Next
        </button>
      </div>
      {/* Pokemon List Display */}
      <div className="pokemon-list">
        {pokemonData
          ? pokemonData.map((poke) => {
              const types = poke.types.map((item) => item.type.name);
              return (
                <div
                  key={poke.id}
                  className="pokemon-card"
                  style={{ backgroundColor: getBackColor(poke) }}
                >
                  <div className="pokemon-details">
                    <button
                      className="info-button"
                      onClick={() => {
                        setShowDialog(!showDialog);
                        setSelectedPokemon(poke);
                      }}
                    >
                      {getPokeId(poke.id)}
                    </button>
                    <h2>{getPokeName(poke.name)}</h2>
                    <p>{`Type: ${types.toString()}`}</p>
                  </div>
                  <div>
                    <img
                      className="pokemon-image"
                      alt={getPokeName(poke.name)}
                      src={poke.sprites.other.dream_world.front_default}
                    ></img>
                  </div>
                </div>
              );
            })
          : "Loading"}
      </div>
      {/* Pokemon Details Display */}
      {showDialog && (
        <div className="dialog">
          <div className="pokemon-details">
            <div
              className="pokemon-image"
              style={{
                backgroundColor: getBackColor(selectedPokemon)
              }}
            >
              <img
                height="150px"
                width="150px"
                alt={getPokeName(selectedPokemon.name)}
                src={
                  selectedPokemon.sprites.other.dream_world.front_default
                }
              ></img>
            </div>
            <div className="pokemon-info">
              <h2>{getPokeName(selectedPokemon.name)}</h2>
              <p>Height: {selectedPokemon.height} m</p>
              <p>Weight: {selectedPokemon.weight} kg</p>
              <div className="tabs">
                <button
                  className={`tab ${tabIndex === 0 ? 'active' : ''}`}
                  onClick={() => setTabIndex(0)}
                >
                  Stats
                </button>
                <button
                  className={`tab ${tabIndex === 1 ? 'active' : ''}`}
                  onClick={() => setTabIndex(1)}
                >
                  Abilities
                </button>
              </div>
              <div className="tab-content">
                {tabIndex === 0 && (
                  <div>
                    <span>HP</span>{" "}
                    <div
                      className="progress-bar"
                      style={{
                        width: `${normalise(selectedPokemon.stats[0].base_stat)}%`
                      }}
                    />
                    {/* Add more stats here */}
                  </div>
                )}
                {tabIndex === 1 && (
                  <div>
                    {selectedPokemon.abilities.map((item) => (
                      <span key={item.ability.name}>
                        {item.ability.name}
                      </span>
                   
                   ))}
                   </div>
                 )}
               </div>
             </div>
           </div>
           <button
             className="close-button"
             onClick={() => {
               setShowDialog(!showDialog);
               setSelectedPokemon({});
             }}
           >
             Close
           </button>
         </div>
       )}
     </>
   );
 };
 
 export default App;
 


import { useEffect, useState } from "react";
import "./App.css";

type TPokemon = {
  name: string;
  url: string;
  id: string;
};

function App() {
  const [pokemons, setPokemons] = useState<Array<TPokemon>>([]);

  function DisplayPokemons(array: Array<TPokemon>) {
    const shuffled = Shuffle(array);
    const pokemonsWithID = shuffled.map((m) => ({
      ...m,
      id: crypto.randomUUID(),
    }));

    return pokemonsWithID;
  }

  function Shuffle(array: Array<TPokemon>) {
    let currentIndex = array.length,
      randomIndex;

    // While there are elements remaining
    while (currentIndex !== 0) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // Swap the current element with the random element
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const GetPokemonSprite = (id: number | string | null) => {
    if (!id) return;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };
  const GetPokemonUri = (offset: number) =>
    `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=5`;

  const GetOffset = () => Math.floor(Math.random() * 101);

  async function GETPokemons() {
    try {
      const randomNumber = GetOffset();
      const uri = GetPokemonUri(randomNumber);
      const res = await fetch(uri);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setPokemons(data.results);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  function ExtractId(url: string) {
    // Split the URL by "/"
    const urlParts = url.split("/");

    // Check if there are at least 4 parts (protocol, domain, resource, id)
    if (urlParts.length < 8) {
      return null; // Not a valid Pokemon URL format
    }

    // Return the element before the last slash (which is the id)
    return urlParts[urlParts.length - 2];
  }

  useEffect(() => {
    GETPokemons();
  }, []);

  // Card Behavior
  const CardClicked = (id: string) => {
    enum ECards {
      ACTIVE = "active",
      MATCHED = "matched",
    }
    const target = document.getElementById(id);

    if (target.classList.contains(ECards.MATCHED)) return -1;

    target.classList.toggle(ECards.ACTIVE);

    const activeCards = document.querySelectorAll(`.${ECards.ACTIVE}`);

    const RemoveActiveCards = () => {
      activeCards[0].classList.remove(ECards.ACTIVE);
      activeCards[1].classList.remove(ECards.ACTIVE);
    };

    if (activeCards.length === 2) {
      if (
        activeCards[0].getAttribute("item-id") ===
        activeCards[1].getAttribute("item-id")
      ) {
        RemoveActiveCards();
        activeCards[0].classList.add(ECards.MATCHED);
        activeCards[1].classList.add(ECards.MATCHED);
      } else {
        RemoveActiveCards();
      }
    }
  };

  return (
    <>
      <h1>Home</h1>
      <ul>
        {DisplayPokemons(pokemons).map((m, i) => (
          <li
            key={i}
            id={m.id}
            className="card"
            item-id={m.name}
            onClick={() => CardClicked(m.id)}
          >
            <img src={`${GetPokemonSprite(ExtractId(m.url))}`} alt={m.name} />
            <h3>{m.name}</h3>
          </li>
        ))}
        {DisplayPokemons(pokemons).map((m, i) => (
          <li
            key={i}
            id={m.id}
            className="card"
            item-id={m.name}
            onClick={() => CardClicked(m.id)}
          >
            <img src={`${GetPokemonSprite(ExtractId(m.url))}`} alt={m.name} />
            <h3>{m.name}</h3>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;

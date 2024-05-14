import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Card from "./components/card/Card.component.tsx";

type TPokemon = {
  name: string;
  url: string;
  id: string;
};

function App() {
  const [pokemons, setPokemons] = useState<Array<TPokemon>>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);

  const DisplayPokemons = useMemo(() => {
    const collection = [...pokemons, ...pokemons];
    const shuffled = Shuffle(collection);
    const pokemonsWithID = shuffled.map((m) => ({
      ...m,
      id: crypto.randomUUID(),
    }));

    return pokemonsWithID;
  }, [pokemons]);

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

  const GetPokemonUri = (offset: number) =>
    `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=10`;

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

  const HandlePlay = async () => {
    setIsPlaying((prev) => !prev);
    if (isPlaying) {
      setPokemons(() => [])
      setIsPlaying(() => false)
      setPoints(() => 0)
    }

    await GETPokemons();
  };

  const UpdatePoints = () => {
    setPoints((prev) => {
      const newVal = prev + 1

      if (newVal) setIsPlaying((_prev) => true)

      return newVal
    });
  };

  return (
    <>
      <h1>Match the Pokemon</h1>
      {
        points > 0 &&
        <div className="points-wrapper">
          <h2 className="point">
            Points: <span className={points ? "value" : "empty"}>{points}</span>
          </h2>
        </div>
      }
      <ul className="card-list">
        {DisplayPokemons.map((m, i) => (
          <Card key={i} id={m.id} name={m.name} url={m.url} AddPoint={UpdatePoints} />
        ))}
      </ul>
      <div className="controls">
        <button className="btn-play" type="button" onClick={() => HandlePlay()}>
          {isPlaying ? "Reset" : "Play"}
        </button>
      </div>
    </>
  );
}

export default App;

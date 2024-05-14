import "./Card.style.css";

interface Props {
  id: string;
  name: string;
  url: string;
  AddPoint: Function;
}

export default function Card({ id, name, url, AddPoint }: Props) {
  const GetPokemonSprite = (id: number | string | null) => {
    if (!id) return;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

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

  const CardClicked = (id: string) => {
    enum ECards {
      ACTIVE = "active",
      MATCHED = "matched",
    }
    const target = document.getElementById(id) as HTMLElement;

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
        AddPoint();
      } else {
        RemoveActiveCards();
      }
    }
  };

  return (
    <li id={id} className="card" item-id={name} onClick={() => CardClicked(id)}>
      <img src={`${GetPokemonSprite(ExtractId(url))}`} alt={name} />
    </li>
  );
}

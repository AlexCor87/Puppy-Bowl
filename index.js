const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2510-alex";
const API = BASE + COHORT;

let players = [];

const playerListEl = document.getElementById("player-list");
const detailsEl = document.getElementById("details");
const addFormEl = document.getElementById("add-form");

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API}/players`);
    const json = await response.json();

    players = json.data.players;
    renderPlayers();
  } catch (err) {
    console.error("Error fetching players:", err);
  }
};

const fetchPlayerById = async (id) => {
  try {
    const response = await fetch(`${API}/players/${id}`);
    const json = await response.json();

    selectedPlayer = json.data.player;
    renderDetails();
  } catch (err) {
    console.error("Error fetching player by ID:", err);
  }
};

const PlayerCard = (player) => {
  const div = document.createElement("div");
  div.className = "player-card";

  div.innerHTML = `
    <img src="${player.imageUrl}" alt="${player.name}" />
    <h3>${player.name}</h3>
  `;

  div.addEventListener("click", () => {
    fetchPlayerById(player.id);
  });

  return div;
};

const renderPlayers = () => {
  playerListEl.innerHTML = "";

  players.forEach((player) => {
    const card = PlayerCard(player);
    playerListEl.appendChild(card);
  });
};

const renderDetails = () => {
  if (!selectedPlayer) {
    detailsEl.innerHTML = "<p>Please select a puppy from the roster.</p>";
    return;
  }
};

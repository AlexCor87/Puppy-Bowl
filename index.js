const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2510-alex";
const API = BASE + COHORT;

let players = [];
let selectedPlayer = null;

const playerListEl = document.getElementById("player-list");
const detailsEl = document.getElementById("details");
const addFormEl = document.getElementById("add-form");
const newNameInput = document.getElementById("new-name");
const newBreedInput = document.getElementById("new-breed");

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

const removePlayer = async (id) => {
  try {
    await fetch(`${API}/players/${id}`, {
      method: "DELETE",
    });

    selectedPlayer = null;
    fetchAllPlayers();
    renderDetails();
  } catch (err) {
    console.error("Error removing player:", err);
  }
};

const addPlayer = async (name, breed) => {
  try {
    await fetch(`${API}/players`, {
      method: "POST", //
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, breed }),
    });

    fetchAllPlayers();
  } catch (err) {
    console.error("Error adding player:", err);
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

  const { name, id, breed, status, imageUrl, team } = selectedPlayer;

  detailsEl.innerHTML = `
    <h3>${name}</h3>
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Breed:</strong> ${breed}</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Team:</strong> ${team ? team.name : "Unassigned"}</p>
    <img src="${imageUrl}" alt="${name}" />
    <br /><br />
    <button id="remove-btn">Remove from roster</button>
  `;

  document.getElementById("remove-btn").addEventListener("click", () => {
    removePlayer(id);
  });
};

addFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = newNameInput.value;
  const breed = newBreedInput.value;

  addPlayer(name, breed);

  addFormEl.reset();
});

fetchAllPlayers();
renderDetails();

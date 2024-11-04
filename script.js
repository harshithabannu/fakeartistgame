let players = [];
let fakeArtistIndex = null;
let votes = {};
let drawingObject = "";
const drawingObjects = [
    "flower", "clock", "pen", "board", "headphones", "chocolate", "apple", "mango", "watch",
    "table", "candle", "football", "TV", "laptop", "keyboard", "tree", "streetlight", "car", 
    "airplane", "train", "bus", "cycle", "phone", "calculator", "ring", "star", "sun", "photo", 
    "lock", "chair", "calendar"
];

let usedTopics = new Set(); // Keep track of used topics

function setupGame() {
    const playerCount = parseInt(document.getElementById("players").value);
    players = Array.from({ length: playerCount }, (_, i) => ({
        id: i + 1,
        role: "Artist",
        drawingObject: "",  // Add property to hold drawing object for each player
    }));

    assignRolesAndObject();

    // Display role cards for each player
    const rolesDiv = document.getElementById("roles");
    rolesDiv.innerHTML = "";
    players.forEach(player => {
        const playerDiv = document.createElement("div");
        playerDiv.className = "player";
        playerDiv.innerHTML = `
            <button onclick="revealRole(${player.id})">Player ${player.id}'s Card</button>
            <span id="role-${player.id}" style="display: none; color: blue;"></span>
        `;
        rolesDiv.appendChild(playerDiv);
    });

    // Show game sections and hide setup screen
    document.querySelector(".setup").style.display = "none";
    document.getElementById("canvasSection").style.display = "block";
    document.getElementById("votingSection").style.display = "block"; // Show voting section
    document.getElementById("nextRoundButton").style.display = "inline";
    
    initDrawing();
}

function assignRolesAndObject() {
    // Randomly assign a fake artist and a new drawing object for each round
    fakeArtistIndex = Math.floor(Math.random() * players.length);
    
    // Select a drawing topic that hasn't been used yet
    do {
        drawingObject = drawingObjects[Math.floor(Math.random() * drawingObjects.length)];
    } while (usedTopics.has(drawingObject));

    // Mark the topic as used
    usedTopics.add(drawingObject);

    players.forEach((player, index) => {
        player.role = index === fakeArtistIndex ? "Fake Artist" : "Artist";
        player.drawingObject = index === fakeArtistIndex ? "" : drawingObject; // Assign same object to all artists
    });

    console.log(`The drawing object for this round is: ${drawingObject}`); // Only Artists see this
}

function revealRole(playerId) {
    const player = players.find(p => p.id === playerId);
    const roleSpan = document.getElementById(`role-${playerId}`);

    // Reveal role based on whether the player is an Artist or the Fake Artist
    if (player.role === "Artist") {
        roleSpan.textContent = `Artist - Draw: ${player.drawingObject}`; // Show individual drawing object
    } else {
        roleSpan.textContent = "Fake Artist"; // Show Fake Artist role
    }
    roleSpan.style.display = "inline";
}

function showRole() {
    const playerNumber = parseInt(document.getElementById("playerNumber").value);
    const roleDisplay = document.getElementById("roleDisplay");

    if (playerNumber < 1 || playerNumber > players.length) {
        roleDisplay.textContent = "Invalid player number!"; // Check for valid player number
        return;
    }

    const player = players[playerNumber - 1];
    if (player.role === "Artist") {
        roleDisplay.textContent = `Your role: Artist - Draw: ${player.drawingObject}`;
    } else {
        roleDisplay.textContent = "Your role: Fake Artist";
    }

    // Clear the role display after a brief moment
    setTimeout(() => {
        roleDisplay.textContent = "";
    }, 3000); // Clear after 3 seconds
}

function initDrawing() {
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    let drawing = false;

    canvas.onmousedown = () => { drawing = true; };
    canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
    canvas.onmousemove = (e) => {
        if (!drawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };
}

function clearCanvas() {
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function findFakeArtist() {
    const voteContainer = document.getElementById("voteContainer");
    voteContainer.innerHTML = "";
    players.forEach(player => {
        const voteBtn = document.createElement("button");
        voteBtn.textContent = `Vote Player ${player.id}`;
        voteBtn.onclick = () => registerVote(player.id);
        voteContainer.appendChild(voteBtn);
    });
}

function registerVote(playerId) {
    votes[playerId] = (votes[playerId] || 0) + 1;
    const maxVotes = Object.values(votes).reduce((max, curr) => Math.max(max, curr), 0);

    if (votes[playerId] === maxVotes) {
        alert(`The group suspects Player ${playerId} is the Fake Artist!`);
        alert(fakeArtistIndex + 1 === playerId ? "Correct!" : "Wrong!");
        votes = {}; // Reset votes for a new round
        nextRound(); // Automatically move to next round after voting
    }
}

function nextRound() {
    clearCanvas();
    votes = {};
    resetToStartPage();
}

// Resets the view to the start page
function resetToStartPage() {
    document.querySelector(".setup").style.display = "block";
    document.getElementById("canvasSection").style.display = "none";
    document.getElementById("votingSection").style.display = "none";
    document.getElementById("nextRoundButton").style.display = "none";
    document.getElementById("roles").innerHTML = ""; // Clear the displayed roles
}

window.onload = () => {
    resetToStartPage(); // Ensure the start page is shown initially
};

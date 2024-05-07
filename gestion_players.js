let score_player_actual=0;
const displayPlayers = (score_player_actual,color) => {
    let userId = localStorage.getItem("userId");

    // Buscamos nuestro jugador
    let player_actual = buscarPlayer(userId);

    let playersElement = document.getElementById("players");
    playersElement.innerHTML = "";

    players.forEach(player => {
        if(player.id === player_actual.id){
            player.score = score_player_actual;
            if (player.score === undefined) {
                player.score = 0;
            }
        }
    });

    // Ordenar los jugadores por puntaje de forma descendente
    players.sort((a, b) => b.score - a.score);

    // Mostrar los jugadores en la página después de que se haya cambiado el puntaje del jugador actual y se haya ordenado la lista
    players.forEach(player => {
        let playerDiv = document.createElement("div");
        playerDiv.textContent = `${player.name}: ${player.score}`;
        if (player.id == userId) {
            playerDiv.style.color =  color ;
        }
        playersElement.appendChild(playerDiv);
        console.log("hola");

    });
}



// Llamar a la función para mostrar los jugadores al inicio
displayPlayers();

function buscarPlayer(idParam){
    return players.find(player => player.id == idParam);
}


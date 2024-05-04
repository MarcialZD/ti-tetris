// Definir arreglo de jugadores con contraseñas y IDs
const players = [
    { id: 1, name: "angelo", score: 70, password: "123" },
    { id: 2, name: "miguel", score: 150, password: "456" },
    { id: 3, name: "marcial", score: 82, password: "789" },
    { id: 4, name: "cristhian", score: 80, password: "987" }
];

// Función para mostrar los jugadores y sus puntajes de forma descendente
const displayPlayers = () => {
    // Ordenar los jugadores por puntaje de forma descendente
    players.sort((a, b) => b.score - a.score);

    let playersElement = document.getElementById("players");
    playersElement.innerHTML = "";
    players.forEach(player => {
        let playerDiv = document.createElement("div");
        playerDiv.textContent = `${player.name}: ${player.score}`;
        playersElement.appendChild(playerDiv);
    });
}

// Llamar a la función para mostrar los jugadores al inicio
displayPlayers();

// Agregar evento de clic al botón de inicio de sesión
document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("login-button");
    const errorMessage = document.getElementById("error-message");

    loginButton.addEventListener("click", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Comprobar si las credenciales coinciden con algún jugador
        const player = players.find(player => player.name === username && player.password === password);
        if (player) {
            // Guardar el ID del usuario en localStorage
            localStorage.setItem("userId", player.id);
            // Si las credenciales coinciden, redirigir a index.html
            window.location.href = "index.html";
        } else {
            // Si las credenciales son incorrectas, mostrar mensaje de error
            errorMessage.style.display = "block";
        }
    });
});

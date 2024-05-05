// Definir arreglo de jugadores con contraseñas y IDs
let players = [
    { id: 1, name: "angelo", score: 70, password: "123" },
    { id: 2, name: "miguel", score: 40, password: "456" },
    { id: 3, name: "marcial", score: 30, password: "789" },
    { id: 4, name: "cristhian", score: 20, password: "987" }
];

$(document).ready(function() {
    $("#login-button").click(function(event) {
        var username = $("#username").val();
        var password = $("#password").val();
        var errorMessage = $("#error-message");

        // Comprobar si las credenciales coinciden con algún jugador
        var player = players.find(function(player) {
            return player.name === username && player.password === password;
        });

        if (player) {
            // Guardar el ID del usuario en localStorage
            localStorage.setItem("userId", player.id);
            // Si las credenciales coinciden, redirigir a index.html
            window.location.href = "index.html";
        } else {
            // Si las credenciales son incorrectas, mostrar mensaje de error
            errorMessage.css("display", "block");
        }
    });
});

function verificarLogeo() {
    if (window.location.pathname === '/index.html') {
        if (localStorage.getItem("userId") === undefined) {
            // Redirige al usuario a login.html
            window.location.href = "login.html";
        }
    }
}

verificarLogeo();

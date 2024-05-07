// Cuando el usuario inicia sesión
localStorage.setItem('userIsLoggedIn', true);

// Cuando necesites verificar si el usuario ha iniciado sesión
if (localStorage.getItem('userIsLoggedIn')) {
    // El usuario ha iniciado sesión
    document.getElementById('login').style.display = 'none';
    document.getElementById('cart').style.display = 'block';
} else {
    // El usuario no ha iniciado sesión
    document.getElementById('login').style.display = 'block';
    document.getElementById('cart').style.display = 'none';
}

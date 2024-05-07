
// Hacer una solicitud Fetch para obtener los datos de los productos
fetch('/products')
    .then(response => response.json())
    .then(data => {
        // Llamar a una función para renderizar los productos
        renderProducts(data);
    })
    .catch(error => {
        console.error('Error al obtener los datos de los productos:', error);
    });

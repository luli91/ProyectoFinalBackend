document.addEventListener('DOMContentLoaded', function() {
    const updateButtons = document.querySelectorAll('.update-button');
    const deleteButtons = document.querySelectorAll('.delete-button');

    // console.log('editButtons:', editButtons);
    // console.log('deleteButtons:', deleteButtons);

    updateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.userId;
            // Obtén el menú desplegable correspondiente a este botón
            const select = document.querySelector('.role-select[data-user-id="' + userId + '"]');
            // Obtén el valor seleccionado del menú desplegable
            const nuevoRol = select.value;
    
            fetch('/api/users/' + userId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ role: nuevoRol }) 
            })
            .then(response => {
                console.log('Response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Data:', data);
                location.reload();
            })
            .catch((error) => console.error('Error:', error));
        });
    });
    

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.userId;

            console.log('Delete button clicked for userId:', userId);
            
            fetch('/api/users/' + userId, {
                method: 'DELETE',
                credentials: 'include',
            })
            .then(response => {
                console.log('Response:', response);
                return response.json();
            })
            .then(data => console.log('Data:', data))
            .catch((error) => console.error('Error:', error));
        });
    });
});

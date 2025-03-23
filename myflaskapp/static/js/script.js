
// Función para cambiar la sección activa
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// Asignar eventos de clic a las opciones del menú de "Browse Music"
const menuItems = document.querySelectorAll('.sidebar ul li');
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Mostrar la sección correspondiente
        showSection(e.target.id + '-section');
    });
});

// Mostrar la primera sección por defecto (Recommendations)
showSection('recommendations-section');

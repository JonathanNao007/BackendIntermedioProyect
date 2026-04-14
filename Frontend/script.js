     // Menús con sus respectivas páginas
        const pages = {
            dashboard: { title: 'Dashboard', desc: 'Bienvenido al panel de control' },
            usuarios: { title: 'Usuarios', desc: 'Gestión de usuarios del sistema' },
            productos: { title: 'Productos', desc: 'Catálogo de productos' },
            ventas: { title: 'Ventas', desc: 'Historial y estadísticas de ventas' },
            configuracion: { title: 'Configuración', desc: 'Ajustes del sistema' }
        };

        // Obtener elementos
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');
        console.log(sections);
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');

        // Función para cambiar de página
        function changePage(pageId) {
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            const selectedSection = document.getElementById(pageId);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
            
            // Actualizar título y descripción
            if (pages[pageId]) {
                pageTitle.textContent = pages[pageId].title;
                pageDescription.textContent = pages[pageId].desc;
            }
            
            // Actualizar clase activa en el menú
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === pageId) {
                    item.classList.add('active');
                }
            });
        }

        function getInfoForSecction(pageId){
            switch(pageId){
                case 'dashboard':

                break;  
                case 'empleados':

                break;
                case 'departamentos':

                break;
                case 'titulosysalarios':

                break;
                case 'incidencias':

                break;
            }
        }

        // Agregar eventos a los menús
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const pageId = this.getAttribute('data-page');
                if (pageId) {
                    changePage(pageId);
                }
            });
        });
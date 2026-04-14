     // Menús con sus respectivas páginas
        const pages = {
            dashboard: { title: 'Dashboard', desc: 'Bienvenido al panel de control' },
            usuarios: { title: 'Empleados', desc: 'Gestión de Empleados del sistema' },
            productos: { title: 'Departamentos', desc: 'Catálogo de departamanetos' },
            ventas: { title: 'Titulos Y Salarios', desc: 'Historial de Titulos y Salarios' },
            configuracion: { title: 'Incidencias', desc: 'Registro de Incidencias' }
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


        async function consultarClima(lat, lon, units = 'metric', lang = 'es') {
            try {
                const url = `/api/openweathermap`;
                console.log('Consultando:', url);
                
                const response = await fetch(url);
                const data = await response.json();
                
                mostrarLoading(false);
                
                if (data.exito) {
                    mostrarClima(data.datos);
                    guardarHistorial(data.datos);
                } else {
                    mostrarError(data.mensaje || 'Error al obtener el clima');
                }
            } catch (error) {
                mostrarLoading(false);
                mostrarError('Error de conexión: ' + error.message);
                console.error('Error:', error);
            }
        }

         // Utilidades
        function mostrarLoading(mostrar) {
            document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
        }
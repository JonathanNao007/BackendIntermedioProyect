     // Menús con sus respectivas páginas
        const pages = {
            dashboard: { title: 'Dashboard', desc: 'Bienvenido al panel de control' },
            empleados: { title: 'Empleados', desc: 'Gestión de Empleados del sistema' },
            departamentos: { title: 'Departamentos', desc: 'Catálogo de departamanetos' },
            titulosysalarios: { title: 'Titulos Y Salarios', desc: 'Historial de Titulos y Salarios' },
            incidencias: { title: 'Incidencias', desc: 'Registro de Incidencias' }
        };

        // Obtener elementos
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');
        console.log(sections);
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');
        const btnSearchEmpleado = document.getElementById('btn-buscarEmpleado');   
        const txtIdEmpleado = document.getElementById('numeroEmp').value;
        const txtNombreEmpleado = document.getElementById('nombreEmp').value;     
        const climaMsg = document.getElementById('clima-text');
        const climaMsgCom = document.getElementById('com-clima');
        btnSearchEmpleado.addEventListener('click', consultaAsignaEmpleados(txtNombreEmpleado, txtIdEmpleado));
        let mensajeClimaActual = '';
        let mensajeClimaActualCom = '';

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

            //
            getInfoForSecction(pageId);
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

        function getInfoForSecction(pageId){
            switch(pageId){
                case 'dashboard':

                break;  
                case 'empleados':                    
                    consultaAsignaEmpleados(txtNombreEmpleado, txtIdEmpleado);
                break;
                case 'departamentos':

                break;
                case 'titulosysalarios':

                break;
                case 'incidencias':

                break;
            }
        }

        async function consultaAsignaEmpleados(){
            try{
                let idEmpleado = document.getElementById('numeroEmp').value;
                let nombreEmpleado = document.getElementById('nombreEmp').value;
                //console.log(`${nombreEmpleado} ${idEmpleado}`);
                mostrarLoading(true);
                let url = `/api/employees`;
                if((nombreEmpleado && nombreEmpleado.trim().length > 0) && (idEmpleado && idEmpleado.trim().length > 0)){
                    url += `?nameEmployee=${nombreEmpleado}&idEmployee=${idEmpleado}`; 
                }
                else if(nombreEmpleado && nombreEmpleado.trim().length > 0){
                    url += `?nameEmployee=${nombreEmpleado}`; 
                }
                else if(idEmpleado && idEmpleado.trim().length > 0){
                    url += `?idEmployee=${idEmpleado}`; 
                }
                //console.log('Consultando:', url);
                 const response = await fetch(url);
                const data = await response.json();
                //console.log(data);
                //console.log(data.length);
                //
                const tableEmp = document.getElementById('empleadosRows');
                //console.log(tableEmp);
                tableEmp.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">                            
                            <tr style="background: #f8f9fa;">
                            <th style="padding: 12px; text-align: left;">No empleado</th>
                            <th style="padding: 12px; text-align: left;">Nombre</th>
                            <th style="padding: 12px; text-align: left;">Genero</th>
                            <th style="padding: 12px; text-align: left;">Fecha Nacimiento</th>
                            <th style="padding: 12px; text-align: left;">Fecha Contratacion</th>
                            <th style="padding: 12px; text-align: left;">Acciones</th>
                            </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                <td style="padding: 12px;">${e.emp_no}</td>
                                <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                <td style="padding: 12px;">${e.gender}</td>
                                <td style="padding: 12px;">${new Date(e.birth_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                <td style="padding: 12px;">${new Date(e.hire_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                <td style="padding: 12px;"><i class="fas fa-edit" style="color: #667eea; margin-right: 5px; cursor: pointer;"></i></td>
                            </tr>`;
                    });
                    rows += `</table>`;
                    tableEmp.innerHTML = rows;
                }
                //
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                // mostrarError('Error de conexión: ' + error.message);
                console.error('Error:', error);
            }
        }

        async function consultarClima(lat, lon, units = 'metric', lang = 'es') {
            try {
                mostrarLoading(true);
                const url = `/api/openweathermap`;
                console.log('Consultando:', url);
                
                const response = await fetch(url);
                const data = await response.json();
                mensajeClimaActual = `${data.temperatura}   ${data.ciudad}`;
                mensajeClimaActualCom = `${data.momento.toUpperCase()} - ${data.descripcion}`;
                climaMsg.textContent = mensajeClimaActual;
                climaMsgCom.textContent = mensajeClimaActualCom;
                mostrarLoading(false);                
                if (data) {
                    mostrarClima(data.datos);
                } else {
                    mostrarError(data.mensaje || 'Error al obtener el clima');
                }
            } catch (error) {
                mostrarLoading(false);
                // mostrarError('Error de conexión: ' + error.message);
                console.error('Error:', error);
            }
        }

        document.addEventListener("DOMContentLoaded", (event) => {
            console.log("The DOM is fully loaded.");
            // Your code to manipulate elements goes here
            //consultarClima();
        });

         // Utilidades
        function mostrarLoading(mostrar) {
            document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
        }
        function mostrarError(mensaje) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = mensaje;
            errorDiv.style.display = 'block';
        }
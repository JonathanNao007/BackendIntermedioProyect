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
        const modal = document.getElementById('modalInfo');    
        const modalTitle = document.getElementById('modalTitle')
        const btnCloseModal = document.getElementById('spanCloseModal');
        //Fomr de incidencias
        const idIncidencia = document.getElementById('idIncidencia');
        const txtNoEmpleadoInc = document.getElementById('txtNoEmpleadoInc');
        const txtTipoInc = document.getElementById('txtTipoInc');
        const txtFechaInc = document.getElementById('txtFechaInc');
        const txtDescripcionInc = document.getElementById('txtDescripcionInc');
        const selectStatusInc = documento.getElementById('selectStatusInc');
        //
        let mensajeClimaActual = '';
        let mensajeClimaActualCom = '';

        btnCloseModal.onclick = () => modal.style.display = "none";
        btnSearchEmpleado.addEventListener('click', consultaAsignaEmpleados(txtNombreEmpleado, txtIdEmpleado));
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
                    consultaAsignaDashboard();
                break;  
                case 'empleados':                    
                    consultaAsignaEmpleados();
                break;
                case 'departamentos':
                    consultaAsignaDepartementos();
                break;
                case 'titulosysalarios':

                break;
                case 'incidencias':
                    consultaAsignaIncidencias();
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
                            <th style="padding: 12px;">No empleado</th>
                            <th style="padding: 12px;">Nombre</th>
                            <th style="padding: 12px;">Genero</th>
                            <th style="padding: 12px;">Fecha Nacimiento</th>
                            <th style="padding: 12px;">Fecha Contratacion</th>
                            <th style="padding: 12px;">Información</th>
                            </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                <td style="padding: 12px;">${e.emp_no}</td>
                                <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                <td style="padding: 12px;">${e.gender}</td>
                                <td style="padding: 12px;">${new Date(e.birth_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                <td style="padding: 12px;">${new Date(e.hire_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                <td style="padding: 12px;">
                                    <i class="fa-solid fa-circle-info" style="color: #667eea; margin-right: 5px; cursor: pointer;" onclick="event.preventDefault(); consultaInfoEmpleado(${e.emp_no});"></i>
                                    <i class="fas fa-th-list" style="color: #667eea; margin-right: 5px; cursor: pointer;" onclick="event.preventDefault(); consultaInfoTitlesEmpleado(${e.emp_no});"></i>
                                    <i class="fa-solid fa-circle-dollar-to-slot" style="color: #667eea; margin-right: 5px; cursor: pointer;" onclick="event.preventDefault(); consultaInfoSalaryEmpleado(${e.emp_no});"></i>
                                </td>
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

        async function consultaAsignaDepartementos(){
            try{
                mostrarLoading(true);
                let url = `/api/departments`;
                const response = await fetch(url);
                const data = await response.json();
                const tableDep = document.getElementById('departamentosRows');
                tableDep.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px;">No Departamento</th>
                                    <th style="padding: 12px;">Departamento</th>
                                    <th style="padding: 12px;">Información</th>
                                </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${e.dept_no}</td>
                                    <td style="padding: 12px;">${e.dept_name}</td>
                                    <td style="padding: 12px;">
                                        <i class="fas fa-th-list" style="color: #667eea; margin-right: 5px; cursor: pointer;" onclick="consultaInfoDepartemento('${e.dept_no}')"></i>
                                    </td>
                                </tr>`;
                    });
                    rows += `</table>`;
                    tableDep.innerHTML = rows;
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function consultaInfoDepartemento(noDapartment){
            try{
                mostrarLoading(true);
                modalTitle.innerText = '';
                let url = `/api/departments/${noDapartment}/employes`;
                const response = await fetch(url);
                const data = await response.json();
                const table = document.getElementById('modalContent');
                table.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px;">No Empleado</th>
                                    <th style="padding: 12px;">Empleado</th>
                                    <th style="padding: 12px;">Departamento</th>
                                    <th style="padding: 12px;">Desde</th>
                                    <th style="padding: 12px;">Hasta</th>
                                </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${e.emp_no}</td>
                                    <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                    <td style="padding: 12px;">${e.dept_name}</td>
                                    <td style="padding: 12px;">${new Date(e.from_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                    <td style="padding: 12px;">${new Date(e.to_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                </tr>`;
                    });
                    rows += `</table>`;
                    modalTitle.innerText = 'Empleados del departamento';
                    table.innerHTML = rows;
                    modal.style.display = "block";
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function consultaInfoEmpleado(noEmpleado){
            try{
                mostrarLoading(true);
                modalTitle.innerText = '';
                let url = `/api/employees/${noEmpleado}`;
                const response = await fetch(url);
                const data = await response.json();
                const table = document.getElementById('modalContent');
                table.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px;">Fecha Nacimiento</th>
                                    <th style="padding: 12px;">Nombre</th>
                                    <th style="padding: 12px;">Fecha Contratacion</th>
                                    <th style="padding: 12px;">Departamento</th>
                                </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${new Date(e.birth_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                    <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>                                                               
                                    <td style="padding: 12px;">${new Date(e.hire_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                    <td style="padding: 12px;">${e.dept_name}</td>         
                                </tr>`;
                    });
                    rows += `</table>`;
                    modalTitle.innerText = 'Información del empleado';
                    table.innerHTML = rows;
                    modal.style.display = "block";
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function consultaInfoTitlesEmpleado(noEmpleado){
            try{
                mostrarLoading(true);
                modalTitle.innerText = '';
                let url = `/api/employees/${noEmpleado}/historialTitles`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                const table = document.getElementById('modalContent');
                table.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px;">No Empleado</th>
                                    <th style="padding: 12px;">Empleado</th>
                                    <th style="padding: 12px;">Puesto</th>
                                    <th style="padding: 12px;">Desde</th>
                                    <th style="padding: 12px;">Hasta</th>
                                </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${e.emp_no}</td>
                                    <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                    <td style="padding: 12px;">${e.title}</td>
                                    <td style="padding: 12px;">${new Date(e.from_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                    <td style="padding: 12px;">${new Date(e.to_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                </tr>`;
                    });
                    rows += `</table>`;
                    modalTitle.innerText = 'Puestos del empleado';
                    table.innerHTML = rows;
                    modal.style.display = "block";
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function consultaInfoSalaryEmpleado(noEmpleado){
            try{
                mostrarLoading(true);
                modalTitle.innerText = '';
                let url = `/api/employees/${noEmpleado}/historialSalary`;
                const response = await fetch(url);
                const data = await response.json();
                const table = document.getElementById('modalContent');
                table.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px;">No Empleado</th>
                                    <th style="padding: 12px;">Empleado</th>
                                    <th style="padding: 12px;">Salario</th>
                                    <th style="padding: 12px;">Desde</th>
                                    <th style="padding: 12px;">Hasta</th>
                                </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${e.emp_no}</td>
                                    <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                    <td style="padding: 12px;">${new Number(e.salary).toLocaleString('en-MX', { style: 'currency', currency: 'USD',})}</td>
                                    <td style="padding: 12px;">${new Date(e.from_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                    <td style="padding: 12px;">${new Date(e.to_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                </tr>`;
                    });
                    rows += `</table>`;
                    modalTitle.innerText = 'Salarios del empleado';
                    table.innerHTML = rows;
                    modal.style.display = "block";
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function consultaAsignaIncidencias(){
            try{
                let descripcionIncidencia = document.getElementById('descripInc').value;
                let tipoIncidencia = document.getElementById('tipoInc').value;
                mostrarLoading(true);
                let url = `/api/incidencias`;
                //
                if((descripcionIncidencia && descripcionIncidencia.trim().length > 0) && (tipoIncidencia && tipoIncidencia.trim().length > 0)){
                    url += `?description=${descripcionIncidencia}&type=${tipoIncidencia}`; 
                }
                else if(descripcionIncidencia && descripcionIncidencia.trim().length > 0){
                    url += `?description=${descripcionIncidencia}`; 
                }
                else if(tipoIncidencia && tipoIncidencia.trim().length > 0){
                    url += `?type=${tipoIncidencia}`; 
                }
                //
                const response = await fetch(url);
                const data = await response.json();
                const tableDep = document.getElementById('incidenciasRows');
                tableDep.innerHTML = '';
                if(data.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                <th style="padding: 12px;">No Incidencia</th>
                                    <th style="padding: 12px;">No Empleado</th>
                                    <th style="padding: 12px;">Empleado</th>
                                    <th style="padding: 12px;">Tipo</th>
                                    <th style="padding: 12px;">Fecha</th>
                                    <th style="padding: 12px;">Descripción</th>
                                    <th style="padding: 12px;">Estatus</th>
                                    <th style="padding: 12px;">Editar</th>
                                </tr> `;
                    data.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${e.id_incidencias}</td>
                                    <td style="padding: 12px;">${e.emp_no}</td>
                                    <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                    <td style="padding: 12px;">${e.tipo}</td>
                                    <td style="padding: 12px;">${new Date(e.fecha).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>                                    
                                    <td style="padding: 12px;">${e.descripcion}</td>
                                    <td style="padding: 12px;">${e.estatus}</td>
                                    <td style="padding: 12px;">
                                        <i class="fas fa-edit" style="color: #667eea; margin-right: 5px; cursor: pointer;" onclick="event.preventDefault();"></i>
                                    </td>
                                </tr>`;
                    });
                    rows += `</table>`;
                    tableDep.innerHTML = rows;
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function consultaAsignaDashboard(){
            try{
                mostrarLoading(true);
                let url = `/api/dashboard/resume`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                const resumeSalariosDep = document.getElementById('resumeSalariesRows');
                const resumeDepartementosRows = document.getElementById('resumeDepartementosRows');
                const resumeContratacionesRows = document.getElementById('resumeContratacionesRows');
                resumeSalariosDep.innerHTML = '';
                if(data.salarios.length > 0){
                    let rows = `<table style="width: 100%;">
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 12px;">Empleado</th>
                                    <th style="padding: 12px;">Genero</th>
                                    <th style="padding: 12px;">Salario</th>
                                </tr> `;
                    data.salarios.forEach(e => {
                        rows += `<tr>
                                    <td style="padding: 12px;">${e.first_name} ${e.last_name}</td>
                                    <td style="padding: 12px;">${e.gender}</td>
                                    <td style="padding: 12px;">${new Number(e.salary).toLocaleString('en-MX', { style: 'currency', currency: 'USD',})}</td>
                                    </tr> `;
                    });
                    rows += `</table>`;
                    resumeSalariosDep.innerHTML = rows;
                }
                resumeDepartementosRows.innerHTML = '';
                if(data.departamentos.length > 0){
                    let rowsDep = `<table class="activity-table">
                                    <tr>
                                        <th>Departamento</th>
                                        <th>Empleados</th>
                                    </tr> `;
                    data.departamentos.forEach(e => {
                        rowsDep += `<tr>
                                        <td>${e.dept_name}</td>
                                        <td>${e.num_emp}</td>
                                    </tr> `;
                    });
                    rowsDep += `</table>`;
                    resumeDepartementosRows.innerHTML = rowsDep;
                }
                resumeContratacionesRows.innerHTML = '';
                if(data.empleados.length > 0){
                    let rowsCon = `<table class="activity-table">
                                    <tr>
                                        <th>Empleado</th>
                                        <th>Genero</th>
                                        <th>Fecha Contratación</th>
                                    </tr> `;
                    data.empleados.forEach(e => {
                        rowsCon += `<tr>
                                        <td>${e.first_name} ${e.last_name}</td>
                                        <td>${e.gender}</td>
                                        <td>${new Date(e.hire_date).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                                    </tr> `;
                    });
                    rowsCon += `</table>`;
                    resumeContratacionesRows.innerHTML = rowsCon;
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        async function guardarIncidencia(){
             try{
                mostrarLoading(true);
                const id = idIncidencia.value;
                const incidencia = {
                    emp_no : txtNoEmpleadoInc.value,
                    tipo : txtTipoInc.value,
                    fecha : txtFechaInc.value,
                    descripcion : txtDescripcionInc.value,
                    estatus : selectStatusInc.value
                }
                console.log(incidencia);
                let response;
                if(id){
                    response = await fetch('', {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json',},
                        body: JSON.stringify(incidencia)
                    });
                }
                else{
                    response = await fetch('', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json',},
                        body: JSON.stringify(incidencia)
                    });
                }
                const data = await response.json();
                if(response.ok){
                    alert(data.mensaje, 'exito');
                    limpiaFormulario();
                    consultaAsignaIncidencias();
                }
                else{
                    alert(data.errores ? data.errores.join(', ') : data.mensaje, 'error');
                }
                mostrarLoading(false);
            } catch(error) {
                mostrarLoading(false);
                console.error('Error:', error);
            }
        }

        function limpiarFormulario() {
            idIncidencia.value = '';
            txtNoEmpleadoInc.value = '';
            txtTipoInc.value = '';
            txtFechaInc.value = '';
            txtDescripcionInc.value = '';
            selectStatusInc.selectedIndex = -1; 
        }

        document.addEventListener("DOMContentLoaded", (event) => {
            console.log("The DOM is fully loaded.");
            //Your code to manipulate elements goes here
            consultaAsignaDashboard();
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
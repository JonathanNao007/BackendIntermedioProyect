const express = require('express');
const cors = require('cors');
const path = require('node:path');
const pool = require('./mysql_db/connection');
//Swagger exports
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const e = require('express');

const app = express();
const PORT = 3000;

const FRONTEND_DIR = path.join(__dirname, '../Frontend');
//config API openweater
const configApi = require('./config.json')
const API_KEY = configApi.ApiKey;
//const API_URL = (ciudad) => `${configApi.Url}?q=${ciudad}&lang=${configApi.Idioma.Español}&units=metric&appid=${API_KEY}`;
const API_URL = (lat, lon) => `${configApi.Url}?lat=${lat}&lon=${lon}&lang=${configApi.Idioma.Español}&units=metric&appid=${API_KEY}`;
q=
app.use(express.static(FRONTEND_DIR));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.get('/api/checkConnection', async(req, res) => {
    try{
        const [rows] = await pool.query("SELECT 1 AS ok;");
        res.json({
            mesaje: "Conexión exitosa",
            resultado: rows[0]
        })
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta",
            error: error.sqlMessage
        })
    }
});

app.get('/api/employees', async(req, res)=>{
    try{        
        const nameEmployee = req.query.nameEmployee ? req.query.nameEmployee.trim() : '';    
        //
        let queryConsult = `SELECT emp_no, first_name, last_name, gender, birth_date, hire_date
                                        FROM employees e`;
        if(nameEmployee !== ''){
            queryConsult += ` WHERE first_name LIKE '%${nameEmployee}%' `;
        }
        queryConsult += ` LIMIT 500;`;
        const [rows] = await pool.query(queryConsult);
        res.json(rows)
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta de empleados",
            error: error.sqlMessage
        })
    }
});

app.get('/api/employees/:id', async(req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const idEmployee = Number.isNaN(id) ? 0 : id;    
        //
        let queryConsult = `SELECT birth_date, first_name, last_name, gender, hire_date, d.dept_name
                                        FROM employees e 
                                        LEFT JOIN dept_emp de ON e.emp_no = de.emp_no
                                        LEFT JOIN departments d ON de.dept_no = d.dept_no
                                        LEFT JOIN titles t ON e.emp_no = t.emp_no
                                        WHERE e.emp_no ='${idEmployee}'
                                        ORDER BY t.to_date DESC
                                        LIMIT 1;`;
        const [rows] = await pool.query(queryConsult);
        res.json(rows)
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta de empleado por id",
            error: error.sqlMessage
        })
    }
});

app.get('/api/employees/:id/historial', async(req, res)=>{
    try{
        const id = parseInt(req.params.id);
        const idEmployee = Number.isNaN(id) ? 0 : id;    
        //
        let queryConsult = `SELECT e.emp_no, first_name, last_name, s.from_date, s.to_date, s.salary, title, t.from_date, t.to_date
                            FROM employees e 
                            RIGHT JOIN salaries s ON e.emp_no = s.emp_no 
                            RIGHT JOIN titles t ON e.emp_no = t.emp_no 
                            WHERE e.emp_no = '${idEmployee}'
                            ORDER BY e.emp_no;`;
        const [rows] = await pool.query(queryConsult);
        res.json(rows)
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta del historial de un emplado",
            error: error.sqlMessage
        })
    }
});

app.get('/api/departments', async (req, res)=>{
    try{
        let query = `SELECT dept_no, dept_name FROM departments;`;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, de los departamentos",
            error: error.sqlMessage
        })
    }    
});

app.get('/api/departments/:dept_no/employes', async (req, res)=>{
    try{
        const dept_no = req.params.dept_no;
        let query = `SELECT dept_name, from_date, to_date, first_name, last_name 
                    FROM departments d
                    LEFT JOIN dept_emp de ON d.dept_no = de.dept_no
                    RIGHT JOIN employees e ON de.emp_no = e.emp_no
                    WHERE de.dept_no = '${dept_no}'
                    ORDER BY de.to_date DESC
                    LIMIT 200;`;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, del historico del empleado",
            error: error.sqlMessage
        })
    }    
});

app.get('/api/incidencias', async (req, res)=>{
    try{
        const description = req.query.description ? req.query.description.trim() : '';
        const type = req.query.type ? req.query.type.trim() : ''; 
        let query = `SELECT  id_incidencias, i.emp_no, tipo, fecha, descripcion, estatus
                    FROM incidencias_rrhh i
                    LEFT JOIN employees e ON i.emp_no = e.emp_no`;

        if(description !== '' && type !== ''){
            query += `WHERE i.decripcion LIKE '%${description}%' 
                    AND i.tipo = '${type}';`;
        }
        else if(description !== ''){
            query += `WHERE i.decripcion LIKE '%${description}%';`;
        }
        else if(type !== ''){
            query += `WHERE i.tipo = '${type}';`;
        }    
        else{
            query += `;`; 
        }    
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, de incidencias",
            error: error.sqlMessage
        })
    }    
});

app.post('/api/incidencias', async (req, res)=>{
    try{
        const {emp_no, tipo, fecha, descripcion, estatus} = req.body;
        let queryInsert = `INSERT INTO incidencias_rrhh(emp_no, tipo, fecha, descripcion, estatus)
                            VALUES ('${emp_no}', '${tipo}', STR_TO_DATE('${fecha}'), '${descripcion}', '${estatus}');`;
        const [rows] = await pool.query(queryInsert);
        res.json(rows);
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, ",
            error: error.sqlMessage
        })
    }    
});

app.put('/api/incidencias/:id', async (req, res)=>{
    try{
        const id = req.params.id ?? '';
        const id_incidencias = Number.isNaN(id) ? 0 : id;  
        //
        const {tipo, fecha, descripcion, estatus} = req.body;
        let query = `UPDATE incidencias_rrhh SET tipo = '${tipo}', fecha = STR_TO_DATE('${fecha}'), descripcion = '${descripcion}', estatus = '${estatus}'
                    WHERE id_incidencias = '${id_incidencias}';`;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, ",
            error: error.sqlMessage
        })
    }    
});

app.get('/api/dashboard/resume', async (req, res)=>{
    try{
        let resumen = {
            empleados: [],
            salarios: [],
            departamentos: []
        };
        let queryEmp = `SELECT first_name, last_name, gender, hire_date FROM employees ORDER BY hire_date DESC LIMIT 10;`;
        let querySal = `SELECT first_name, last_name, gender, salary, title  FROM salaries s 
                        LEFT JOIN employees e ON s.emp_no = e.emp_no
                        LEFT JOIN titles t ON e.emp_no = t.emp_no 
                        ORDER BY salary DESC
                        LIMIT 10;`;
        let queryDep = `SELECT d.dept_name, COUNT(e.emp_no) FROM departments d
                        LEFT JOIN dept_emp de ON d.dept_no = de.dept_no
                        LEFT JOIN employees e ON de.emp_no = e.emp_no 
                        GROUP BY d.dept_no;`;
                        //
        const [rowsE] = await pool.query(queryEmp);
        const [rowsS] = await pool.query(querySal);
        const [rowsD] = await pool.query(queryDep);
        //
        resumen.empleados = rowsE ?? [];
        resumen.salarios = rowsS ?? [];
        resumen.departamentos = rowsD ?? [];
        //
        res.json(resumen);
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, ",
            error: error.sqlMessage
        })
    }    
});

app.get('/api/openweathermap', async (req, res)=> {
    try{

        let salida = {
            ciudad: `--`,
            temperatura: `--°`,
            descripcion: `--`,
            momento: '--'
        };
        const latitud = 19.4285;
        const longitud = -99.1277;
        //const ciudad = req.query.ciudad ? req.query.ciudad.trim() : configApi.CiudadInicial;
        if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;
            console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
            },
            (error) => {
            console.error("Error obteniendo ubicación:", error.message);
            }
        );
        } else {
        console.log("Geolocalización no soportada por el navegador");
        }
        //
        //console.log(ciudad);
        console.log(API_URL(latitud, longitud));
        const response = await fetch(API_URL(latitud, longitud));
        if(response.ok){
            const datosW = await response.json();
            console.log(datosW);
            salida = {
            ciudad: `${datosW.name}, ${datosW.sys.country}`,
            temperatura: `${datosW.main.temp}°`,
            descripcion: `${datosW.weather[0].description}`,
            momento: (datosW.weather[0].icon).includes('n') ? 'noche' : 'dia'};
        }
        else{
            throw new Error(`HTTP error! status: ${response.status}`);
        }        
        res.json(salida);
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la consulta, del api del openweathermap",
            error: error
        })
    }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
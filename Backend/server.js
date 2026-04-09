const express = require('express');
const cors = require('cors');
const path = require('node:path');
const pool = require('./mysql_db/connection');
//Swagger exports
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();
const PORT = 3000;

const FRONTEND_DIR = path.join(__dirname, '../Frontend');

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
            mensaje: "Error en la conexión",
            error: error.mensaje
        })
    }
});

app.get('/api/employees', async(req, res)=>{
    try{        
        const nameEmployee = req.query.nameEmployee ? req.query.nameEmployee.trim() : '';    
        //
        let queryConsult = `SELECT birth_date, first_name, last_name, gender, , d.dept_name
                                        FROM employees e 
                                        LEFT JOIN dept_emp de ON e.emp_no = de.emp_no
                                        LEFT JOIN departments d ON de.dept_no = d.dept_no`;
        if(nameEmployee !== ''){
            queryConsult += ` WHERE first_name LIKE '%${nameEmployee}%' `;
        }
        queryConsult += ` LIMIT 500;`;
        const [rows] = await pool.query(queryConsult);
        res.json(rows)
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la conexión",
            error: error.mensaje
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
                                        WHERE emp_no ='%${idEmployee}%';`;
        const [rows] = await pool.query(queryConsult);
        res.json(rows)
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la conexión",
            error: error.mensaje
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
                            WHERE e.emp_no = '%${idEmployee}%'
                            ORDER BY e.emp_no;`;
        const [rows] = await pool.query(queryConsult);
        res.json(rows)
    } catch(error){
        console.error(error);
        res.status(500).json({
            mensaje: "Error en la conexión",
            error: error.mensaje
        })
    }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
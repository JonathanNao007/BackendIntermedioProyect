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

app.get('/api/test', async(req, res) => {
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
        const [rows] = await pool.query(`SELECT birth_date, first_name, last_name, gender, hire_date, d.dept_name
                                        FROM employees e 
                                        LEFT JOIN dept_emp de ON e.emp_no = de.emp_no
                                        LEFT JOIN departments d ON de.dept_no = d.dept_no
                                        LIMIT 500;`);
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
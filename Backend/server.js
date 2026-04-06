const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { pool, resume } = require('./mysql_db/connection');

const app = express();
const PORT = 3000;

const FRONTEND_DIR = path.join(__dirname, '../Frontend');

app.use(express.static(FRONTEND_DIR));
app.use(express.json());

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




app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
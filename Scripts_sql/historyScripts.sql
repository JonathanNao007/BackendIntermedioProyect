USE employees;
SELECT * FROM employees;
SELECT * FROM departments;

--
SELECT birth_date, first_name, last_name, gender, hire_date, d.dept_name
	FROM employees e 
	LEFT JOIN dept_emp de ON e.emp_no = de.emp_no
	LEFT JOIN departments d ON de.dept_no = d.dept_no
	LEFT JOIN titles t ON e.emp_no = t.emp_no
	WHERE e.emp_no ='10010'
    ORDER BY t.to_date DESC
    LIMIT 1;
    
-- Consulta departamentos
SELECT dept_no, dept_name FROM departments;

-- Consulta de departamentos por empleado
SELECT dept_name, from_date, to_date, first_name, last_name 
FROM departments d
LEFT JOIN dept_emp de ON d.dept_no = de.dept_no
RIGHT JOIN employees e ON de.emp_no = e.emp_no
WHERE de.dept_no = 'd005'
ORDER BY de.to_date DESC;

-- Creacion de la tabla de incidencias 
-- DROP TABLE incidencias_rrhh;
CREATE TABLE incidencias_rrhh (
    id_incidencias int NOT NULL AUTO_INCREMENT, 
    emp_no int NOT NULL,
    tipo varchar(50),
    fecha date DEFAULT(current_date()), 
    descripcion varchar(400),
    estatus smallint DEFAULT(0),
    PRIMARY KEY (id_incidencias),
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no)
);

-- Consulta de incidencias
SELECT  id_incidencias, emp_no, tipo, fecha, descripcion, estatus
FROM incidencias_rrhh i
LEFT JOIN employees e ON i.emp_no = e.emp_no
WHERE i.decripcion LIKE '% %' 
AND i.tipo = '0'

-- insertar nuevos registros
INSERT INTO incidencias_rrhh(emp_no, tipo, fecha, descripcion, estatus)
VALUES ('', '', '', '', '');

-- actualizar registros
UPDATE incidencias_rrhh SET tipo = '', fecha = '', descripcion = '', estatus = ''
WHERE id_incidencias = '';


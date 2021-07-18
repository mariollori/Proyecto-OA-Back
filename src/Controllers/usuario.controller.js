import { pool } from '../database'
const jwt = require('jsonwebtoken')
const bcrypt =require('bcryptjs')

export const readUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select p.nombres,p.apellidos,p.telefono from persona p ,usuario  u where u.idpersona=p.idpersona and u.idusuario = $1', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const createUser = async (req, res) => {

    try {
        const { usuario, password, idpersona } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
      
        const response = await pool.query('insert into usuario(username, password, idpersona) values($1, $2, $3)', [usuario, hash, idpersona]);
        
        return res.status(200).json(
            `Usuario ${usuario} creado correctamente...!`);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}

import { pool } from '../database'

const bcrypt =require('bcryptjs')

export const readUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select p.nombre,p.apellido,p.telefono,p.correo,u.tipo from persona p ,personal_ayuda  u where u.idpersonal=$1 and u.idpersona=  p.idpersona ', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const createUser = async (req, res) => {

    try {
        const { usuario, password, idpersonal } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
      
        const response = await pool.query('insert into usuario(username, password, idpersonal) values($1, $2, $3)', [usuario, hash, idpersonal]);
        
        return res.status(200).json(
            `Usuario ${usuario} creado correctamente...!`);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
}


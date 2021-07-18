import { response } from 'express';
import { pool } from '../database';
const bcryptjs =require('bcryptjs')
const jwt = require('jsonwebtoken');

const secret = "ex4m3n-p4r614l-3";
const refreshTokenSecret = "ex4m3n-p4r614l-3-refresh-access-token";
export const login=async(req,res)=>{

    const {username,password} =req.body;
    console.log(username,password);

    try {
        const usuario  = await pool.query('select * from usuario where username=$1 and estado=1',[username]);
       
        if(usuario.rows.length!=0){
         
            const passold= usuario.rows[0].password;
           
            if(await bcryptjs.compare(password,passold)){
                const payload = { idusuario:usuario.rows[0].idusuario}
                const token = jwt.sign(payload,secret,{expiresIn:'10m'})
                return res.status(200).json({token})
            }else{
                return res.status(403).json({
                    message: 'Username o Password incorrectos...!',
                    passold,password
                });
            }
        }else{
            return res.status(500).json({ msg: 'Usuario o Contraseña invalidados'})
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
  
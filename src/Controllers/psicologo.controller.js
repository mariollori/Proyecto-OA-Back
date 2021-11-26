import { pool } from '../database'

const bcrypt =require('bcryptjs')
var nodemailer = require('nodemailer');

export const listarpsicologosdes = async (req, res) => {
    try {

        // estado = 0 =>> desactivado
        // estado = 1 =>> sin asignar
        // estado = 2 =>> activo
        const response = await pool.query(
        `select pr.idpersonal,pr.codigo, pr.tipo,pr.especialidad ,pr.tipo,pr.ciclo,pr.grupo,pr.universidad ,
         p.nombre,p.apellido,p.correo,p.telefono
        from personal_ayuda pr, persona p 
        where  pr.estado = 1 and pr.idpersona = p.idpersona;
          
        `);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}




export const crearusuariooa=async(req,res)=>{
    try {
      const { username, password, idpersonal , destino} = req.body;
    
       enviarmensaje(username,password,destino);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const response = await pool.query('insert into usuario(username, password, idpersonal) values($1, $2, $3)', [username, hash, idpersonal])
        const response2 = await pool.query('update personal_ayuda set estado = $1 where idpersonal=$2', [2,idpersonal])
        return res.status(200).json("Exito al crear el usuario");
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
  
 
 



  }

 async function enviarmensaje(usuario,password,destino){
   try {
    var mailOptions = {
      from: 'examen3dad@gmail.com',
      to:destino,
      subject: 'Crenciales de inicio de sesion',
      text: `Felicidades, su solicitud ha sido aceptada.
      Estas son las credenciales asignadas para que pueda acceder al sistema.
      Usuario: ${usuario} 
      Contraseña: ${password}`
    };
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'examen3dad@gmail.com',
      pass: 'chain@24'
    }
  });
    await transporter.sendMail(mailOptions);
    console.log('sise puede V:')
   } catch (error) {
     console.log(error);
   }

  }
 




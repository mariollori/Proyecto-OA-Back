import { pool } from '../database'

const bcrypt =require('bcryptjs')
var nodemailer = require('nodemailer');

export const listarpsicologosdes = async (req, res) => {
    try {

        // estado = 0 =>> desactivado
        // estado = 1 =>> sin asignar
        // estado = 2 =>> activo
        // estado = 3 =>> ocupado
        const response = await pool.query(
        `select pr.idpersonal,pr.codigo, pr.especialidad ,pr.ciclo,pr.grupo,pr.universidad ,pr.campo,pr.distrito,
         p.nombre,p.apellido,p.correo,p.telefono,p.tipo,p.idpersona
        from personal_ayuda pr, persona p 
        where  pr.estado = 1 and pr.idpersona = p.idpersona;
          
        `);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const deletesolicitud = async (req, res) => {
  try {
      const {idpersonal,idpersona} = req.body
      // estado = 0 =>> desactivado
      // estado = 1 =>> sin asignar
      // estado = 2 =>> activo
      // estado = 3 =>> ocupado
      const response3 = await pool.query( `delete from horario_psicologo where idpersonal =$1`,[idpersonal]);
      const response = await pool.query( `delete from personal_ayuda where idpersonal =$1`,[idpersonal]); 
      const response2 = await pool.query( `delete from persona where idpersona =$1`,[idpersona]);

    
  
      
      return res.status(200).json('Solicitud eliminada.');
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
    var  contentHTML = `
     <img src='https://www.upeu.edu.pe/wp-content/uploads/2021/05/oido-AMIGO-LOGOTIPO1-300x99.png' width="150" height="50"  >
      <h2 style="color:teal">Credenciales de Sesion</h2>
      <ul style="list-style:none">
          <li style="font-size: 16px;color : black">Usuario: ${usuario}</li>
          <li style="font-size: 16px;color : black">Contraseña: ${password}</li>
      </ul>`;
    var mailOptions = {
      from: '"Oido Amigo" <examen3dad@gmail.com>', 
      to:destino,
      subject: 'Crenciales de inicio de sesion',
      html:contentHTML,
     
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
 


  export const crearmensaje=async(req,res)=>{
    try {
      const { usuario,password,destino} = req.body;
     var  contentHTML = `
     <img src='https://www.upeu.edu.pe/wp-content/uploads/2021/05/oido-AMIGO-LOGOTIPO1-300x99.png' width="150" height="50"  >
      <h2 style="color:teal">Credenciales de Sesion</h2>
      <ul style="list-style:none">
          <li style="font-size: 16px;color : black">Usuario: ${usuario}</li>
          <li style="font-size: 16px;color : black">Contraseña: ${password}</li>
      </ul>`;
      var mailOptions = {
        from: '"Oido Amigo" <examen3dad@gmail.com>', 
        to:destino,
        subject: 'Crenciales de inicio de sesion',
        html:contentHTML,
       
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
       
        return res.status(200).json("Exito al crear el usuario");
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
  
 
 



  }


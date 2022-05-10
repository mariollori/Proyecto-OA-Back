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
        `select pr.idpersonal,p.nombre,p.apellido,p.telefono,pr.tipo,p.idpersona,p.correo
        from personal_ayuda pr, persona p 
        where  pr.estado = 1 and pr.idpersona = p.idpersona;
          
        `);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const list_personal_sede = async (req, res) => {
  try {
      const {tipo,sede} = req.query;
      var response;
      // estado = 0 =>> desactivado
      // estado = 1 =>> sin asignar
      // estado = 2 =>> activo
      // estado = 3 =>> ocupado
      if(tipo=='estudiante'){
        response = await pool.query(
          `select pr.idpersonal,p.nombre,p.apellido,p.telefono,pr.tipo,p.idpersona,p.correo,e.ciclo,e.grupo,e.codigo
          from personal_ayuda pr, persona p , estudiante e
            where  pr.estado = 1 and pr.sede = $1  and pr.tipo = 'estudiante' and e.idpersonal = pr.idpersonal and pr.idpersona = p.idpersona ;`,[sede]);
      }else {
        response = await pool.query(
          `select pr.idpersonal,p.nombre,p.apellido,p.telefono,pr.tipo,p.idpersona,p.correo,psi.grado_academico,psi.especialidad,psi.n_colegiatura
          from personal_ayuda pr, persona p ,  psicologo psi 
            where  pr.estado = 1 and pr.sede = $1  and pr.tipo = 'psicologo' and psi.idpersonal = pr.idpersonal and pr.idpersona = p.idpersona ;`,[sede]);
      }
      return res.status(200).json(response.rows);
  } catch (e) {
      console.log(e);
      return res.status(500).json('Error Interno...!');
  }
}

export const deletesolicitud = async (req, res) => {
  try {
      const {idpersonal,idpersona,tipo} = req.body
      // estado = 0 =>> desactivado
      // estado = 1 =>> sin asignar
      // estado = 2 =>> activo
      // estado = 3 =>> ocupado
      const response3 = await pool.query( `delete from horario_psicologo where idpersonal =$1`,[idpersonal]);
      if(tipo=='estudiante'){
        const response4 = await pool.query( `delete from estudiante where idpersonal =$1`,[idpersonal]); 
      }else{
        const response4 = await pool.query( `delete from psicologo where idpersonal =$1`,[idpersonal]); 
      }
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
      const { username, password, idpersonal , destino,rol} = req.body;
    
       enviarmensaje(username,password,destino);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const response = await pool.query('insert into usuario(username, password,estado) values($1, $2,$3) returning idusuario', [username, hash,1])
        const response2 = await pool.query('update personal_ayuda set estado = $1, idusuario = $2,nro_pacientes = 0 where idpersonal=$3', [2, response.rows[0].idusuario,idpersonal]);
        const response3 = await pool.query('insert into usuario_rol(idrol,idusuario) values($1,$2)',[ rol,response.rows[0].idusuario])

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
      pass: 'eghcdiuktxxkfepz'
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
        pass: 'eghcdiuktxxkfepz'
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


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
    
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const response = await pool.query('insert into usuario(username, password,estado) values($1, $2,$3) returning idusuario', [username, hash,1])
      const response2 = await pool.query('update personal_ayuda set estado = $1, idusuario = $2,nro_pacientes = 0 where idpersonal=$3', [2, response.rows[0].idusuario,idpersonal]);
      const response3 = await pool.query('insert into usuario_rol(idrol,idusuario) values($1,$2)',[ rol,response.rows[0].idusuario])
      enviarmensaje(username,password,destino);

        return res.status(200).json("Exito al crear el usuario");
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
  
 
 



  }

 async function enviarmensaje(usuario,password,destino){
   try {
    var  contentHTML = `
    <table width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#f7f9fa;padding:24px">
    <tbody><tr>
            <td>&nbsp;</td>
            <td width="600">
                <table width="100%" cellpadding="0" cellspacing="0"
                    style="background-color:#fff">

                    <tbody><tr>
                            <td style="border-bottom:1px solid
                                #cccccc;padding:24px">

                                <img
                                    style="display:block;max-height:35px;width:auto"
                                    src="https://files.adventistas.org/noticias/es/2020/04/22184401/oido-AMIGO-LOGOTIPO.jpg"
                                    alt="Udemy" width="75" class="CToWUd">

                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 24px 0 24px">
                                <p><a
                                        style="text-decoration:none;color:#1c1d1f">
                                        Hola.
                                    </a></p>
                                <p>
                                    <a
                                        style="text-decoration:none;color:#1c1d1f">Hemos verificado tus datos 
                                        y adjuntamos las credenciales para tu inicio de sesion.</a>
                                </p>
                                <p>
                                    <a
                                        style="text-decoration:none;color:#1c1d1f">Usuario: ${usuario}</a>
                                </p>
                                <p style="margin-bottom:0">
                                    <a
                                        style="text-decoration:none;color:#1c1d1f">Contraseña: ${password}</a>
                                </p>
                            </td>
                        </tr>
                       
                        <tr>
                            <td style="padding:48px 24px 0 24px">
                                <p style="font-family:'SF Pro
                                    Text',-apple-system,BlinkMacSystemFont,Roboto,'Segoe
                                    UI',Helvetica,Arial,sans-serif,'Apple Color
                                    Emoji','Segoe UI Emoji','Segoe UI
                                    Symbol';font-size:12px;font-weight:400;line-height:1.4;color:#6a6f73;margin:0">
                                    <span class="il">Que tengas un buen dia.</span>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 0 0 0"></td>
                        </tr>
                    </tbody></table>
            </td>
            <td>&nbsp;</td>
        </tr>
    </tbody></table>
   
     `;
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
 

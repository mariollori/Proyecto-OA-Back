import { pool } from '../database'
var nodemailer = require('nodemailer');


 export const get_asignaciones_pendientes = async (req, res) => {
     try{
       const sede = req.params.sede;
     const asignaciones = await pool.query(`
     select a.categoria, pe.nombre,pe.apellido,a.descripcion,pa.idpaciente,a.fecha,pe.edad,pe.genero,a.idasignacion,a.idpersonal,a.idpaciente,pa.departamento,pa.provincia
     from asignaciones a,persona pe, paciente pa ,personal_ayuda pn
     where 
   a.estado='En Espera' and a.idpersonal = pn.idpersonal and pn.sede = $1 and a.idpaciente = pa.idpaciente  and pa.idpersona = pe.idpersona;`,[sede]);
       return res.status(200).json(asignaciones.rows);
     }catch(e){
        
         return res.status(500).json('Error Interno....!');
     }

 }

 export const get_paciente_data = async (req, res) => {
  try{
    const idpaciente = req.params.id;
    const asignaciones = await pool.query(`
    select pa.departamento,pa.provincia,pa.distrito,a.descripcion,pa.como_conocio,pe.nombre,pe.apellido,pe.edad,a.respuestas,pe.genero,pe.telefono,a.categoria
    from paciente pa,persona pe ,asignaciones a
    where pa.idpaciente = $1 and pe.idpersona = pa.idpersona and a.idpaciente = $1 and a.estado = 'En Espera'`,[idpaciente]);
    return res.status(200).json(asignaciones.rows);
  }catch(e){
     
      return res.status(500).json('Error Interno....!');
  }

}



export const get_personal_data = async (req, res) => {
  try{
    const idpersonal = req.params.id;
    const tipo = await pool.query('select tipo from personal_ayuda where idpersonal =$1',[idpersonal]);
    var response;
    if(tipo.rows[0].tipo == 'estudiante'){
        response = await pool.query('select pe.nombre,pe.apellido,pe.telefono ,pa.foto,e.ciclo,e.grupo,e.codigo,pa.tipo,pa.idpersonal,pa.sede from personal_ayuda pa,estudiante e,persona pe  where pa.idpersonal=$1  and e.idpersonal=pa.idpersonal and pa.idpersona = pe.idpersona', [idpersonal]);
    }else if(tipo.rows[0].tipo == 'psicologo'){
        response = await pool.query('select pe.nombre,pe.apellido,pe.telefono,pa.foto,p.n_colegiatura,p.grado_academico,p.especialidad,pa.tipo,pa.idpersonal,pa.sede from personal_ayuda pa,psicologo p ,persona pe where pa.idpersonal=$1 and p.idpersonal=pa.idpersonal and pa.idpersona = pe.idpersona ', [idpersonal]);
    }else{
    
    }
    return res.status(200).json(response.rows);
  }catch(e){
     
      return res.status(500).json('Error Interno....!');
  }

}


export const update_asignacion__de_personal = async (req, res) => {
  try{
    const idpersonal = parseInt(req.body.idpersonal);
    const idasignacion = parseInt(req.body.idasignacion);
    const codex = req.body.codex;
    var f = new Date();
    const response = await pool.query(`update asignaciones set idpersonal=$1, estado = 'En Proceso',nro_atenciones = 0 ,codex=$2,fecha_asig=$3 where idasignacion = $4`,[idpersonal,codex,f,idasignacion]);
    const email = await pool.query('select pe.correo from personal_ayuda pa,persona pe where pa.idpersonal =$1 and pe.idpersona = pa.idpersona',[idpersonal]);
    enviarmensaje(email.rows[0].correo);

    return res.status(200).json('Gracias por Confirmar la asignacion.');
  }catch(e){
     
      return res.status(500).json('Error Interno....!');
  }

}





async function enviarmensaje(destino){
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
                                   alt="" width="75" class="CToWUd">

                           </td>
                       </tr>
                       <tr>
                           <td style="padding:24px 24px 0 24px">
                               <p><a
                                       style="text-decoration:none;color:#1c1d1f">
                                       Felicidades.
                                   </a></p>
                               <p>
                                   <a
                                       style="text-decoration:none;color:#1c1d1f">Se le ha asignado un nuevo paciente, por favor inicie sesion y revise su bandeja. Link-> https://oidoamigo.netlify.app/#/home/loginpsi</a>
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
   </tbody></table>`;
   var mailOptions = {
     from: '"Oido Amigo" <examen3dad@gmail.com>', 
     to:destino,
     subject: 'Nueva asignación',
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
 
  } catch (error) {
    
  }

 }

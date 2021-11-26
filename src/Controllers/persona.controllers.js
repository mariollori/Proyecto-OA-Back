import { pool } from '../database'
var nodemailer = require('nodemailer');




export const enviarcorreo=async(req,res)=>{
    const {mensaje,titulo,destinatario,fecha,idusuario} = req.body;
    var mailOptions = {
        from: 'examen3dad@gmail.com',
        to: destinatario,
        subject: titulo,
        text: mensaje
      };
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'examen3dad@gmail.com',
          pass: 'chain@24'
        }
      });
    try {
        transporter.sendMail(mailOptions);
        const response = await pool.query('insert into correo(mensaje,titulo,destinatario,fecha,idusuario) values($1,$2,$3,$4,$5)',
        [mensaje,titulo,destinatario,fecha,idusuario])
        return res.status(200).json("Exito al enviar el correo");
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
  
 
 



  }

 





  

  
export const getcorreos = async(req,res)=>{
    const idusuario = req.params.id;
    try {
        const response = await pool.query('select * from correo where idusuario = $1',[idusuario]);

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}


  




export const crearpaciente=async(req,res)=>{
    const {paciente,persona} = req.body;
  
    try {
   
        const responseper = await  pool.query('insert into persona(nombre,apellido,correo,genero,telefono,tipo,dni) values($1,$2,$3,$4,$5,$6,$7)   RETURNING idpersona',[persona.nombre,persona.apellido,persona.correo,persona.genero,persona.telefono,'paciente',persona.dni])
        
        if(responseper.rows[0].length!=0){
            var f = new Date();
            
           
            const responseuser= await pool.query(`insert into paciente(descripcion,idpersona,motivo,fecha,estado,nro_cita) values($1,$2,$3,$4,$5,nextval('citas')) RETURNING nro_cita`,[paciente.descripcion,responseper.rows[0].idpersona,paciente.motivo,f,'Sin Asignar']);
             return res.status(200).json(` ${persona.nombre } , su consulta ha sido registrada.
             Nro de cita: ${responseuser.rows[0].nro_cita}
              en breve se le asignara un especialista.`);
        } else{
            console.log('error al crear paciente')

        }
        
               
      
        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}


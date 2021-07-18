import { pool } from '../database'
var nodemailer = require('nodemailer');



export const obtenerpersonas= async(req,res)=>{
     const  estado  = req.params.estado
    try {
        const response = await pool.query('select * from persona where estado = $1', [estado]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
}

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

 


export const crearuser=async(req,res)=>{
    const {usuario,docente} = req.body;

    try {
        const resdoc = await  pool.query('insert into docente(idcategoria,idpersona,estadocontrato,estado,estadocat) values($1,$2,$3,$4,$5)   RETURNING iddocente',[docente.idcategoria,docente.idpersona,docente.estadocontrato,true,docente.estadocat])
        console.log(resdoc.rows[0].iddocente)
        if(resdoc.rows[0].length!=0){
          const resuser =  pool.query('insert into usuario(usuario,password,iddocente) values($1,$2,$3)',[usuario.user,usuario.password,resdoc.rows[0].iddocente]);
          
          const mensaje = `Felicidades, su solicitud ha sido aceptada.
          Estas son las credenciales asignadas para que pueda acceder al sistema.
          Usuario: ${usuario.user} 
          Contraseña: ${usuario.password}`
          enviarmensaje(mensaje)
          
        }
        
        return res.status(200).json(`Usuario ${usuario.user} registrado correctamente.`);
        
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
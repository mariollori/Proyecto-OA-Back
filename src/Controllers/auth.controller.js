
import { pool } from '../database';
var nodemailer = require('nodemailer');
const bcryptjs =require('bcryptjs')
const jwt = require('jsonwebtoken');

const secret2 = "f0rg0t3d p4ssw059";

const secret = "ex4m3n-p4r614l-3";

const refreshTokenSecret = "ex4m3n-p4r614l-3-refresh-access-token";
export const login=async(req,res)=>{

    const {username,password} =req.body;
    try {
        const responesuser  = await pool.query('select * from usuario where username=$1 and estado=1 ',[username]);
        if(responesuser.rows.length!=0){
            const passold= responesuser.rows[0].password;
            if(await bcryptjs.compare(password,passold)){
                const usuario = {"idusuario":responesuser.rows[0].idusuario};
                const responsepersonal = await pool.query('select idpersonal from personal_ayuda where idusuario=$1',[responesuser.rows[0].idusuario]);
                const personal = {"idpersonal":responsepersonal.rows[0].idpersonal}
                const responserol  = await pool.query('select r.idrol, r.nombre  from rol r, usuario_rol ur  where  ur.idusuario=$1 and ur.idrol = r.idrol',[responesuser.rows[0].idusuario]);
                const roles = responserol.rows;
                const payload = { personal,usuario, roles}
                const token = jwt.sign(payload,secret,{expiresIn:'180m'})
                return res.status(200).json({token})
            }else{
                return res.status(403).json({
                    message: 'Usuario  o Contraseña incorrectos...!',
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
  









export const forgot_password=async(req,res)=>{

    const {email} =req.body;
    try {
        let message;
        const verify = await pool.query('select u.idusuario from  usuario u, personal_ayuda pa , persona p where  p.correo=$1 and pa.idpersona = p.idpersona and  u.idusuario = pa.idusuario',[email])
        if(verify.rows.length > 0){
            const payload = { "toky": verify.rows[0].idusuario }
            const token = jwt.sign(payload,secret2,{expiresIn:'12m'})
            await pool.query('update usuario set resettoken = $1 where idusuario=$2',[token,verify.rows[0].idusuario])
            const url = `http://localhost:4200/home/change-password/${token}`;
            await enviarmensaje(url,email);
            message='Porfavor verifique su correo electronico para modificar su constraseña.'
            return res.status(200).json(message);
        }else{ 
          message = 'Verifique que el correo enviado sea el correcto.';
          return res.status(500).json(message);
        }
        

    } catch (error) {
        return res.status(500).json(error);
    }
}
  

export const change_password= async(req,res)=>{

    const {newpassword} =req.body;
    const tokverify = req.header('authorization');
    var v = 0;

    try {
        
        jwt.verify(tokverify, secret2, (err, decoded) => {
            if (err) {
                return  res.status(401).json({
                    success: 0,
                    message: "Algo salio mal porfavor reenvie el link de la solicitud."
                });
            } else {
                v = 1;
            }
        });
        if(v==1){
            const security = await pool.query('select idusuario from usuario where resettoken = $1',[tokverify]);
            const salt = await bcryptjs.genSalt(10);
            const hash = await bcryptjs.hash(newpassword, salt);
            const response = await pool.query('update usuario set password=$1 where idusuario=$2',[hash,security.rows[0].idusuario])
            const response2 = await pool.query(`update usuario set resettoken= 'null' where idusuario=$1`,[security.rows[0].idusuario])
            return res.status(200).json({message:'Su constraseña fue restablecida con exito'});
        }else{
            return res.status(500).json({message:'Algo salio mal, por favor reenvie la solicitud.'});
        }
    } catch (error) {
       
        return res.status(500).json(error);
    }
}


async function enviarmensaje(token,destino){
    try {
     var  contentHTML = `
      <img src='https://www.upeu.edu.pe/wp-content/uploads/2021/05/oido-AMIGO-LOGOTIPO1-300x99.png' width="150" height="50"  >
       <h2 style="color:teal">Recuperar contraseña</h2>
       <ul style="list-style:none">
           <li style="font-size: 16px;color : black">Ingrese a este link para poder cambiar su contraseña: <a href="${token}"> ${token}<a></li>
       </ul>`;
     var mailOptions = {
       from: '"Oido Amigo" <examen3dad@gmail.com>', 
       to:destino,
       subject: 'Recuperar Contraseña',
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
   
    } catch (error) {
   
    }
 
   }
  
 
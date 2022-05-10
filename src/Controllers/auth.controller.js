
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
            const token = jwt.sign(payload,secret2,{expiresIn:'15m'})
            await pool.query('update usuario set resettoken = $1 where idusuario=$2',[token,verify.rows[0].idusuario])
            const url = `https://oidoamigo.netlify.app/#/home/change-password/${token}`;
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
                                        style="text-decoration:none;color:#1c1d1f">Hemos
                                        recibido una solicitud de
                                        restablecimiento de contraseña de tu
                                        cuenta.</a>
                                </p>
                                <p>
                                    <a
                                        style="text-decoration:none;color:#1c1d1f">Haz
                                        clic en el botón que aparece a
                                        continuación para cambiar tu contraseña.</a>
                                </p>
                                <p style="margin-bottom:0">
                                    <a
                                        style="text-decoration:none;color:#1c1d1f">Ten
                                        en cuenta que este enlace es válido solo
                                        durante un periodo de 15 minutos. Una vez transcurrido
                                        el plazo, deberás volver a solicitar el
                                        restablecimiento de la contraseña.</a>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:16px 24px 0 24px">
                                <a href="${token}" style="    color: white;
                                border: 1px solid #cccccc;
                                background: black;
                                font-weight: bold;
                                padding: 15px;
                                display: inline-block;
                                font-size: 13px;
                            "
                                    target="_blank"
                                    data-saferedirecturl="https://www.google.com/url?q=${token}">
                                    <span
                                        style="background:#1c1d1f;color:#fff;display:inline-block;min-width:80px;border-top:14px
                                        solid #1c1d1f;border-bottom:14px solid
                                        #1c1d1f;border-left:12px solid
                                        #1c1d1f;border-right:12px solid
                                        #1c1d1f;text-align:center;text-decoration:none;white-space:nowrap;font-family:'SF
                                        Pro
                                        Display',-apple-system,BlinkMacSystemFont,Roboto,'Segoe
                                        UI',Helvetica,Arial,sans-serif,'Apple
                                        Color Emoji','Segoe UI Emoji','Segoe UI
                                        Symbol';font-size:16px;font-weight:700;line-height:1.2;letter-spacing:-0.2px">Cambia
                                        Tu Contraseña</span>
                                </a>
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
       subject: 'Recuperar Contraseña',
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
  
 
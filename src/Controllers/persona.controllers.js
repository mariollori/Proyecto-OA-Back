import { pool } from '../database'
var nodemailer = require('nodemailer');




export const enviarcorreo = async (req, res) => {
    const { mensaje, titulo, destinatario, fecha, idusuario } = req.body;
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
            [mensaje, titulo, destinatario, fecha, idusuario])
        return res.status(200).json("Exito al enviar el correo");
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }






}










export const getcorreos = async (req, res) => {
    const idusuario = req.params.id;
    try {
        const response = await pool.query('select * from correo where idusuario = $1', [idusuario]);

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }



}







export const crearpaciente = async (req, res) => {
    const { paciente, persona } = req.body;

    try {
        var sql1 = ` select pa.idpersonal from  personal_ayuda pa, usuario u, usuario_rol ru , rol r where  pa.estado = $1 and pa.nro_pacientes <= 4 and u.idusuario =pa.idusuario  and ru.idusuario = u.idusuario and r.idrol = ru.idrol and r.nombre = $2 order by pa.nro_pacientes  limit 1;`;
        var sql2 = `select pa.idpersonal from  personal_ayuda pa, usuario u, usuario_rol ru , rol r where  pa.estado = $1  and u.idusuario =pa.idusuario  and ru.idusuario = u.idusuario and r.idrol = ru.idrol and r.nombre = $2 order by pa.nro_pacientes  limit 1;`;
        var sql3 =`INSERT INTO asignaciones(idpersonal,idpaciente,fecha,estado,respuestas,descripcion,categoria) values($1,$2,$3,$4,$5,$6,$7)`;
        var responseuser;
        var idpersonal;
        var estado_asignacion;
        var idpaciente_exist;
        var f = new Date();
        idpaciente_exist = await pool.query('select pa.idpaciente, pe.idpersona from  paciente pa,persona pe where pe.dni = $1 and pa.idpersona = pe.idpersona',[persona.dni]);

        if(idpaciente_exist.rowCount > 0){
            estado_asignacion = await pool.query(`select  estado from asignaciones where  not estado = 'Cancelado' and not  estado = 'Finalizado' and idpaciente = $1`,[idpaciente_exist.rows[0].idpaciente]);
            if(estado_asignacion.rowCount > 0){
                return res.status(500).json(` ${persona.nombre}, usted ya esta registrado, en breve se le contactara`);
            }else{
                await pool.query('update  persona set correo = $1, telefono = $2 , edad = $3  where idpersona = $4', [persona.correo, persona.telefono, persona.edad,idpaciente_exist.rows[0].idpersona]) 
                await pool.query('update paciente set como_conocio=$1,departamento=$2,provincia=$3,distrito=$4 where idpaciente = $5',[paciente.como_conocio,paciente.departamento,paciente.provincia,paciente.distrito,idpaciente_exist.rows[0].idpaciente])
                if (paciente.categoria == 'Riesgo' || paciente.categoria == 'Moderado') {
                    idpersonal = await pool.query(sql2,[2,'Psicologo'])
                    if (idpersonal.rowCount == 0) {
                        idpersonal = await pool.query(sql2,[3,'Psicologo'])
                    }
                } else {    
                    idpersonal = await pool.query(sql1,[2,'Interno']);
                    if (idpersonal.rowCount == 0) {       
                        idpersonal = await pool.query(sql1,[3,'Interno']);
                    }
                }
                await pool.query(sql3, [idpersonal.rows[0].idpersonal, idpaciente_exist.rows[0].idpaciente, f, 'En Espera',paciente.respuestas,paciente.descripcion,paciente.categoria]);
                await pool.query('INSERT INTO historial_ingresos(idpaciente,fecha,estado) values($1,$2,$3)',[idpaciente_exist.rows[0].idpaciente,f,'Reingreso']);
            }
            return res.status(200).json(` ${persona.nombre} , su consulta ha sido registrada.En breve se le brindará la atención que necesita.`);
        }else{
            const responseper = await pool.query('insert into persona(nombre,apellido,correo,genero,telefono,dni,edad) values($1,$2,$3,$4,$5,$6,$7)   RETURNING idpersona', [persona.nombre, persona.apellido, persona.correo, persona.genero, persona.telefono, persona.dni, persona.edad])
            if (responseper.rows[0].length != 0) {
                responseuser = await pool.query(`insert into paciente(idpersona,nro_cita,como_conocio,departamento,provincia,distrito) values($1,nextval('citas'),$2,$3,$4,$5) RETURNING nro_cita,idpaciente`, [ responseper.rows[0].idpersona, paciente.como_conocio,paciente.departamento,paciente.provincia,paciente.distrito]);
                if (paciente.categoria == 'Riesgo' || paciente.categoria == 'Moderado') {
                    idpersonal = await pool.query(sql2,[2,'Psicologo'])
                    if (idpersonal.rowCount == 0) {
                        idpersonal = await pool.query(sql2,[3,'Psicologo'])
                    }
                } else {    
                    idpersonal = await pool.query(sql1,[2,'Interno']);
                    if (idpersonal.rowCount == 0) {
                        idpersonal = await pool.query(sql1,[3,'Interno']);
                    }
                }
                await pool.query(sql3, [idpersonal.rows[0].idpersonal, responseuser.rows[0].idpaciente, f, 'En Espera',paciente.respuestas,paciente.descripcion,paciente.categoria]);
            } else {
                return res.status(500).json('Error al registrar, intente de nuevo en unos segundos!');
            }
            return res.status(200).json(` ${persona.nombre} , su consulta ha sido registrada. Nro de cita: ${responseuser.rows[0].nro_cita} ,En breve se le brindará la atención que necesita.`);
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}


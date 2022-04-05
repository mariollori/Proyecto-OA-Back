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
        var responseuser;
        var idpersonal;
        var f = new Date();
        const responseper = await pool.query('insert into persona(nombre,apellido,correo,genero,telefono,tipo,dni,edad) values($1,$2,$3,$4,$5,$6,$7,$8)   RETURNING idpersona', [persona.nombre, persona.apellido, persona.correo, persona.genero, persona.telefono, 'paciente', persona.dni, persona.edad])
        if (responseper.rows[0].length != 0) {
            responseuser = await pool.query(`insert into paciente(descripcion,idpersona,estado,nro_cita,motivo,origen,categoria,respuestas) values($1,$2,$3,nextval('citas'),$4,$5,$6,$7) RETURNING nro_cita,idpaciente`, [paciente.descripcion, responseper.rows[0].idpersona, 'Sin Asignar', paciente.motivo, paciente.origen, paciente.categoria, paciente.respuestas]);
            if (paciente.categoria == 'Riesgo' || paciente.categoria == 'Moderado') {
                idpersonal = await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='psicologo' and a.estado = 2 order by a.nro_pacientes  limit 1;`)

                if (idpersonal.rowCount == 0) {
                    console.log(idpersonal);
                    idpersonal = await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='psicologo' and a.estado = 3  order by RANDOM() LIMIT 1 ;`)
                }
            } else {

                idpersonal = await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='estudiante' and a.estado = 2  order by a.nro_pacientes limit 1;`);
                if (idpersonal.rowCount == 0) {
                    console.log(idpersonal);
                    idpersonal = await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='estudiante' and a.estado = 3  order by RANDOM() LIMIT 1;`);
                }
            }
            console.log(idpersonal);
            await pool.query('INSERT INTO asignaciones(idpersonal,idpaciente,fecha,estado) values($1,$2,$3,$4)', [idpersonal.rows[0].idpersonal, responseuser.rows[0].idpaciente, f, 'En Espera']);
        } else {
            console.log('error al crear paciente')
        }

        return res.status(200).json(` ${persona.nombre} , su consulta ha sido registrada.
        Nro de cita: ${responseuser.rows[0].nro_cita} ,
        En breve se le brindará la atención que necesita.`);


    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}


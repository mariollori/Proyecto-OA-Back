import { pool } from '../database'

// export const getPanelAsignaciones = async (req, res) => {

//     try{
//     const asignaciones = await pool.query(`select p.nombre, p.apellido, a.motivo, p.telefono, a.estado from persona p, paciente a where p.idpersona = a.idpaciente and a.estado = 'Sin Asignar'`);
//     if(asignaciones.rows.length===0){
//         return res.status(400).json({
//             msg: 'No hay asignaciones!'
//         })
//     }
//      res.status(200).json(asignaciones.rows);



//     }catch(e){
//         console.log(e);
//         return res.status(500).json('Error Interno....!');
//     }
// }

// export const buscarasignacion = async (req, res) => {
//     try{
//     const asignaciones = await pool.query(`select p.nombre, p.apellido, a.motivo, p.telefono, a.estado from persona p, paciente a where p.idpersona = a.idpaciente and a.idpaciente = $1` , [estado]);
//     if(asignaciones.rows.length===0){
//         return res.status(400).json({
//             msg: 'No hay asignaciones!'
//         })
//     }
//      res.status(200).json(asignaciones.rows);



//     }catch(e){
//         console.log(e);
//         return res.status(500).json('Error Interno....!');
//     }

// }



export const buscarasignacion = async (req, res) => {
    try {
        const estado = req.query.estado;
        console.log(estado);
        const response = await pool.query(`
        select p.nombre, p.apellido,a.idpaciente, a.motivo,a.descripcion, p.genero,
        p.telefono, a.estado from persona p, paciente a where a.idpersona = p.idpersona
         and a.estado= $1`, [estado]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}




export const get_Data_Psi_asignado = async (req, res) => {
    try {
        console.log(req.params.id)
        const idpaciente = req.params.id

        const response = await pool.query(`
        select p.nombre, p.apellido,p.tipo,p.telefono,p.correo,a.especialidad, a.universidad, 
        a.grado_academico, a.n_colegiatura,a.ciclo,a.grupo ,a.codigo 
        from persona p, personal_ayuda a,asignaciones asig where asig.idpaciente = $1
         and asig.idpersonal= a.idpersonal and a.idpersona= p.idpersona`, [idpaciente]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}




export const get_ultima_observacion = async (req, res) => {
    try {

        const idpaciente = req.params.id

        const response = await pool.query(`
        select  distinct re.condicion, re.observaciones
        from asignaciones asig,registro_atencion re 
        where re.fecha_sesion = (SELECT MAX(re.fecha_sesion) FROM registro_atencion re ,asignaciones asig WHERE asig.idpaciente = $1 and 
        asig.idasignacion = re.idasignacion	)
 LIMIT 1 `, [idpaciente]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
//Personal Ayuda

export const getpersonalayudadisponible = async (req, res) => {
    try {
        const estado = req.query.estado;
        const response = await pool.query(`
        select pa.ciclo,pa.especialidad,pa.grupo,pa.idpersonal,pa.codigo,pa.universidad,pa.grado_academico,
        p.nombre,p.apellido,p.idpersona
         from personal_ayuda pa, persona p 
         where p.tipo =$1 and 
         p.idpersona=pa.idpersona
         and pa.estado=2`, [estado]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}





export const asignarpac_psi = async (req, res) => {
    try {
        const { idpersonal, idpaciente } = req.body;
        const f = new Date();
        const response = await pool.query(`
       insert into asignaciones(idpersona,idpaciente,fecha) values($1,$2,$3)`, [idpersonal, idpaciente, f]);
        const response2 = await pool.query(` update paciente set estado='En Proceso' where idpaciente=$1`, [idpaciente])
        return res.status(200).json({ message: 'Asignacion registrada.' });
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const asignarpac_estud = async (req, res) => {
    try {
        const { idpersonal, idpaciente } = req.body;
        const f = new Date();
        const response = await pool.query(`
       insert into asignaciones(idpersonal,idpaciente,fecha) values($1,$2,$3)`, [idpersonal
            , idpaciente, f]);
        const response2 = await pool.query(` update paciente set estado='En Proceso' where idpaciente=$1`, [idpaciente])
        const response3 = await pool.query(` update personal_ayuda set estado=3 where idpersonal=$1`, [idpersonal])
        var message = {
            app_id: "0f4599ff-8cbe-4d06-a525-f637d5c40dc0",
            contents: {"en": "Se asigno un paciente xd", "es": "Se le asigno un nuevo paciente" },
            channel_for_external_user_ids: "push",
            include_external_user_ids: [`${idpersonal}`]
        };
        
        sendNotification(message);
        return res.status(200).json({ message: 'Asignacion registrada.' });
    } catch (e) {
        return res.status(500).json(e);
    }
}


var sendNotification = function (data) {
    
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic NDEwOWNlZmYtMjAwNy00NDY4LTk1ZTctYjExM2EwZTVkMTEz"
    };


    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
};


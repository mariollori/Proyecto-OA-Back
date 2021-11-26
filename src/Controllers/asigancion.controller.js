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
        const estado=req.query.estado;
        console.log(estado);
        const response = await pool.query(`select p.nombre, p.apellido, a.motivo,a.descripcion, p.telefono, a.estado from persona p, paciente a where a.idpersona = p.idpersona and a.estado= $1`,[estado]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}


//Personal Ayuda

export const getpersonalayudadisponible = async (req, res) => {
    try {
        const estado=req.query.estado;
        const response = await pool.query(`
        select pa.ciclo,pa.especialidad,pa.grupo,pa.idpersonal,pa.codigo,pa.universidad,pa.grado_academico,
        p.nombre,p.apellido,p.idpersona
         from personal_ayuda pa, persona p 
         where p.tipo =$1 and
         p.idpersona=pa.idpersona`,[estado]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}



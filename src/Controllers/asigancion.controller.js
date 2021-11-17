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
        const response = await pool.query(`select p.nombre, p.apellido, a.motivo, p.telefono, a.estado from persona p, paciente a where a.idpersona = p.idpersona and a.estado= $1`,[estado]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

//PASTOR

export const getPastor = async (req, res) => {
    try {
        const response = await pool.query(`select *from personal_ayuda where tipo ='pastor'`);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

//ESTUDIANTE

export const getEstudiante = async (req, res) => {
    try {
        const response = await pool.query(`select *from personal_ayuda where tipo ='estudiante'`);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

//PSICOLOGO

export const getPsicologo = async (req, res) => {
    try {
        const response = await pool.query(`select *from personal_ayuda where tipo ='psicologo'`);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
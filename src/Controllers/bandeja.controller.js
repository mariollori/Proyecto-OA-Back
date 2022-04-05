import { pool } from '../database'


 export const get_asignaciones_pendientes = async (req, res) => {
     try{
     const asignaciones = await pool.query(`
       select pa.categoria, pe.nombre,pe.apellido,pa.descripcion,pa.idpaciente,a.fecha,pe.edad,pe.genero,a.idasignacion,a.idpersonal,a.idpaciente,pa.origen
       from asignaciones a,persona pe, paciente pa 
       where a.estado='En Espera' and a.idpaciente = pa.idpaciente and pa.idpersona = pe.idpersona;`);
       return res.status(200).json(asignaciones.rows);
     }catch(e){
         console.log(e);
         return res.status(500).json('Error Interno....!');
     }

 }

 export const get_paciente_data = async (req, res) => {
  try{
    const idpaciente = req.params.id;
    const asignaciones = await pool.query(`
    select pa.origen,pa.descripcion,pa.motivo,pe.nombre,pe.apellido,pe.edad,pa.respuestas,pe.genero,pe.telefono,pa.categoria
    from paciente pa,persona pe 
    where pa.idpaciente = $1 and pe.idpersona = pa.idpersona`,[idpaciente]);
    return res.status(200).json(asignaciones.rows);
  }catch(e){
      console.log(e);
      return res.status(500).json('Error Interno....!');
  }

}



export const get_personal_data = async (req, res) => {
  try{
    const idpersonal = req.params.id;
    const tipo = await pool.query('select tipo from personal_ayuda where idpersonal =$1',[idpersonal]);
    var response;
    if(tipo.rows[0].tipo == 'estudiante'){
        response = await pool.query('select pe.nombre,pe.apellido,pe.telefono ,pa.foto,e.ciclo,e.grupo,e.codigo,pa.tipo,pa.idpersonal from personal_ayuda pa,estudiante e,persona pe  where pa.idpersonal=$1  and e.idpersonal=pa.idpersonal and pa.idpersona = pe.idpersona', [idpersonal]);
    }else if(tipo.rows[0].tipo == 'psicologo'){
        response = await pool.query('select pe.nombre,pe.apellido,pe.telefono, p.universidad,pa.foto,p.n_colegiatura,p.grado_academico,p.especialidad,pa.tipo,pa.idpersonal from personal_ayuda pa,psicologo p ,persona pe where pa.idpersonal=$1 and p.idpersonal=pa.idpersonal and pa.idpersona = pe.idpersona ', [idpersonal]);
    }else{
    
    }
    return res.status(200).json(response.rows);
  }catch(e){
      console.log(e);
      return res.status(500).json('Error Interno....!');
  }

}


export const update_asignacion__de_personal = async (req, res) => {
  try{
    const idpersonal = parseInt(req.body.idpersonal);
    const idasignacion = parseInt(req.body.idasignacion);

    const response = await pool.query(`update asignaciones set idpersonal=$1, estado = 'En Proceso',nro_atenciones = 0  where idasignacion = $2`,[idpersonal,idasignacion]);
    return res.status(200).json('Gracias por Confirmar la asignacion.');
  }catch(e){
      console.log(e);
      return res.status(500).json('Error Interno....!');
  }

}

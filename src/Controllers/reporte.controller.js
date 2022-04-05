import { pool } from '../database'

export const obtenerestadisticas_genero = async (req, res) => {
    try {
        const sexo = req.params.genero


        const response = await pool.query(`
        select  asig.estado ,count(*)
        from paciente p ,
             asignaciones asig,
             persona pe
         where  asig.idpaciente = p.idpaciente and p.idpersona = pe.idpersona and pe.genero = $1
           group by asig.estado`, [sexo]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}



export const buscarpersonal = async (req, res) => {
    try {
        var response;
        const tipo = req.query.tipo.toString();
        const sede = req.query.tipo;
        if(tipo == 'estudiante'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,e.ciclo,p.correo,e.codigo,a.nro_pacientes
            from persona p, personal_ayuda a,estudiante e  where a.estado!=1 and a.estado!=0 and a.idpersona = p.idpersona and
            a.tipo = 'estudiante'and e.idpersonal=a.idpersonal`);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,  p.correo,pi.grado_academico,pi.especialidad,a.nro_pacientes
            from persona p, personal_ayuda a , psicologo pi where a.estado!=1 and a.estado!=0 and a.idpersona = p.idpersona and
            a.tipo ='psicologo'and pi.idpersonal=a.idpersonal`);
        }
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
export const buscarpersonal_sede = async (req, res) => {
    try {
        var response;
        const tipo = req.query.tipo.toString();
        const sede = req.query.sede.toString();
        if(tipo == 'estudiante'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,e.ciclo,p.correo,e.codigo,a.nro_pacientes
            from persona p, personal_ayuda a,estudiante e  where a.estado!=1 and a.estado!=0 and a.idpersona = p.idpersona and
            a.tipo = 'estudiante' and a.sede = $1 and  e.idpersonal=a.idpersonal`,[sede]);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,  p.correo,pi.grado_academico,pi.especialidad,a.nro_pacientes
            from persona p, personal_ayuda a , psicologo pi where a.estado!=1 and a.estado!=0 and a.idpersona = p.idpersona and
            a.tipo ='psicologo' and a.sede =$1 and pi.idpersonal=a.idpersonal`,[sede]);
        }
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const personal_by_id = async(req,res)=>{
    try {
        const tipo = req.query.tipo;
        const id = req.query.id;
        var response;
        if(tipo == 'estudiante'){
            response = await pool.query(` 
            select p.nombre, p.apellido,e.ciclo,p.correo,e.codigo,p.telefono,a.foto from persona p, personal_ayuda a,estudiante e where  a.idpersonal  = $1 and a.idpersona = p.idpersona and e.idpersonal = a.idpersonal `,[id]);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,pi.grado_academico,p.correo,pi.especialidad,p.telefono,a.foto
            from persona p, personal_ayuda a,psicologo pi where  a.idpersonal  = $1 and a.idpersona = p.idpersona and pi.idpersonal = a.idpersonal 
            `,[id]);
        }else{

        }
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}


export const estadisticas_generales_tipo_sede = async (req, res) => {
    try {
        const tipo = req.query.tipo.toString();
        const sede = req.query.sede.toString();
        var response;
        if(tipo=="todos"){
            response = await pool.query(`
            select  asig.estado ,count(*)
            from asignaciones asig,personal_ayuda pa
            where pa.idpersonal = asig.idpersonal and  pa.sede =$1
             group by asig.estado`,[sede]);

        }else{
            response = await pool.query(`
            select  asig.estado ,count(*)
            from asignaciones asig,personal_ayuda pa
            where pa.idpersonal = asig.idpersonal and pa.tipo = $1 and pa.sede =$2
             group by asig.estado`,[tipo,sede]);
        }
         return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const estadisticas_generales_tipo_sede_fecha = async (req, res) => {
    try {
        const tipo = req.query.tipo.toString();
        const sede = req.query.sede.toString();
        const fechai = req.query.fechai;
        const fechaf = req.query.fechai;
        var response ;
        if(tipo=="todos"){
            response = await pool.query(`
            select  asig.estado ,count(*)
            from asignaciones asig,personal_ayuda pa
            where pa.idpersonal = asig.idpersonal and asig.fecha >= $1 and asig.fecha <= $2  and pa.sede =$3
             group by asig.estado` ,[fechai,fechaf,sede]);
        }else{
             response = await pool.query(`
            select  asig.estado ,count(*)
            from asignaciones asig,personal_ayuda pa
            where pa.idpersonal = asig.idpersonal and asig.fecha >= $1 and asig.fecha <= $2  and pa.tipo = $3 and pa.sede =$4
             group by asig.estado` ,[fechai,fechaf,tipo,sede]);
        }
      
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const obtenerestadisticas = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await pool.query(`
        select  asig.estado ,count(*)
        from asignaciones asig
         where asig.idpersonal = $1 
           group by asig.estado`, [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
export const obtenerestadisticas_fecha = async (req, res) => {
    try {
        console.log(req.query.id)
        const id = req.query.id;
        const fechai = req.query.fechai;
        const fechaf = req.query.fechaf;


        const response = await pool.query(`
        select  p.estado ,count(*)
        from paciente p
        ,asignaciones asig
         where asig.idpersonal = $1 and
		 asig.fecha >= $2 and asig.fecha <= $3 and
		 asig.idpaciente = p.idpaciente
           group by p.estado`, [id, fechai, fechaf]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}



export const get_asignaciones_by_id = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await pool.query(`
        select pe.nombre,pe.apellido,pe.telefono,asig.fecha,p.categoria,p.origen,p.descripcion,p.religion,p.ciudad,p.ocupacion,p.grado_educacion,p.estado_civil,p.problema_actual,p.antecedentes,asig.idasignacion,pe.edad,pe.genero
        from paciente p , asignaciones asig, persona pe
         where  asig.idpersonal = $1 and asig.estado = 'Finalizado' and  asig.idpaciente = p.idpaciente and p.idpersona = pe.idpersona`, [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const get_atenciones_by_id = async (req, res) => {
    try {
        const id = req.params.id;

        const response = await pool.query(`
        select ra.nro_sesion,ra.observaciones,ra.conclusiones,ra.acciones_realizadas,ra.recomendaciones,ra.fecha_sesion,ra.evidencia
        from  registro_atencion ra
         where  ra.idasignacion = $1 order by ra.nro_sesion asc`, [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}


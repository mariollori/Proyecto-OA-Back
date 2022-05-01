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
            from persona p, personal_ayuda a,estudiante e,usuario u,usuario_rol ur
            where a.estado!=1 and a.estado!=0   and a.idpersona = p.idpersona and u.idusuario = a.idusuario and
            ur.idusuario = u.idusuario and ur.idrol = 21 and e.idpersonal=a.idpersonal;`);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,  p.correo,pi.grado_academico,pi.especialidad,a.nro_pacientes
        from persona p, personal_ayuda a , psicologo pi,usuario u,usuario_rol ur
         where a.estado!=1 and a.estado!=0  and  a.idpersona = p.idpersona and u.idusuario = a.idusuario and
        ur.idusuario = u.idusuario and ur.idrol = 8 and pi.idpersonal=a.idpersonal;`);
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
            select p.nombre, p.apellido,a.idpersonal,  p.correo,es.ciclo,es.codigo,es.grupo,a.nro_pacientes
            from persona p, personal_ayuda a , estudiante es,usuario u,usuario_rol ur,rol r
            where a.estado!=1 and a.estado!=0 and a.sede = $1 and  a.idpersona = p.idpersona and u.idusuario = a.idusuario and
            ur.idusuario = u.idusuario and r.idrol = ur.idrol and r.nombre = 'Interno'  and es.idpersonal=a.idpersonal;
            `,[sede]);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,  p.correo,pi.grado_academico,pi.especialidad,a.nro_pacientes
            from persona p, personal_ayuda a , psicologo pi,usuario u,usuario_rol ur,rol r
            where a.estado!=1 and a.estado!=0 and a.sede = $1 and  a.idpersona = p.idpersona and u.idusuario = a.idusuario and
            ur.idusuario = u.idusuario and r.idrol = ur.idrol and r.nombre = 'Psicologo'  and pi.idpersonal=a.idpersonal;            
        `,[sede]);
        }else{

        }
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
export const buscar_personal_menor_4 = async (req, res) => {
    try {
        var response;
        const tipo = req.query.tipo.toString();
        const sede = req.query.sede.toString();
        if(tipo == 'estudiante'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,  p.correo,es.ciclo,es.codigo,es.grupo,a.nro_pacientes
            from persona p, personal_ayuda a , estudiante es,usuario u,usuario_rol ur,rol r
            where a.estado!=1 and a.estado!=0 and a.sede = $1 and a.nro_pacientes <= 4 and  a.idpersona = p.idpersona and u.idusuario = a.idusuario and
            ur.idusuario = u.idusuario and r.idrol = ur.idrol and r.nombre = 'Interno'  and es.idpersonal=a.idpersonal;
            `,[sede]);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,a.idpersonal,  p.correo,pi.grado_academico,pi.especialidad,a.nro_pacientes
            from persona p, personal_ayuda a , psicologo pi,usuario u,usuario_rol ur,rol r
            where a.estado!=1 and a.estado!=0 and a.sede = $1 and  a.idpersona = p.idpersona and u.idusuario = a.idusuario and
            ur.idusuario = u.idusuario and r.idrol = ur.idrol and r.nombre = 'Psicologo'  and pi.idpersonal=a.idpersonal;            
        `,[sede]);
        }else{

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
            select p.nombre, p.apellido,e.ciclo,e.grupo,p.correo,e.codigo,p.telefono,a.foto,p.genero,a.sede from persona p, personal_ayuda a,estudiante e where  a.idpersonal  = $1 and a.idpersona = p.idpersona and e.idpersonal = a.idpersonal `,[id]);
        }else if(tipo == 'psicologo'){
            response = await pool.query(`
            select p.nombre, p.apellido,pi.grado_academico,p.correo,pi.especialidad,p.telefono,a.foto,pi.especialidad,p.genero,a.sede
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
        if(tipo=="todos" && sede=="todos"){
            response = await pool.query(`
            select  asig.estado ,count(*)
            from asignaciones asig,personal_ayuda pa
            where pa.idpersonal = asig.idpersonal   group by asig.estado`);
        }else if(tipo=="todos" && sede!="todos"){
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
        if(tipo=="todos" && sede=="todos"){
            response = await pool.query(`
            select  asig.estado ,count(*)
            from asignaciones asig,personal_ayuda pa
            where pa.idpersonal = asig.idpersonal and asig.fecha >= $1 and asig.fecha <= $2 
             group by asig.estado` ,[fechai,fechaf]);

        }else if(tipo=="todos" && sede!="todos"){
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



export const get_asignaciones_by_id = async (req, res) => {
    try {
        const id = req.params.id;
       const tipo = req.query.tipo;
        const response = await pool.query(`
        select  
        asig.categoria,pe.nombre,pe.apellido,pe.telefono,asig.fecha,p.departamento,p.provincia,p.distrito,asig.descripcion,p.religion,p.ocupacion,p.grado_educacion,p.estado_civil,asig.problema_actual,asig.antecedentes,asig.idasignacion,pe.edad,pe.genero,p.como_conocio,p.fecha_nacimiento,p.nro_hijos,
        asig.motivo,asig.estado,asig.respuestas
        from paciente p , asignaciones asig, persona pe
         where  asig.idpersonal = $1 and asig.estado = $2 and  asig.idpaciente = p.idpaciente and p.idpersona = pe.idpersona`, [id,tipo]);
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

export const get_comentarios_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query(`
        select pu.descripcion,pu.puntaje,pe.nombre,pe.apellido,pe.genero from puntajes pu ,persona pe,paciente pa where pu.idpersonal = $1 and pa.idpaciente = pu.idpaciente and pe.idpersona = pa.idpersona `, [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const get_puntaje_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query(`
        select count(*), pu.puntaje  from puntajes pu where pu.idpersonal= $1 group by  pu.puntaje;`, [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
export const get_puntaje_total_by_id = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query(`
        select round(avg(puntaje),1),count(*) from puntajes where idpersonal=$1;`, [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}



export const get_comentarios = async (req, res) => {
    try {
        
        const response = await pool.query(`
        select pu.descripcion,pu.puntaje,pe.nombre,pe.apellido,pe.genero from puntajes pu ,persona pe,paciente pa where  pa.idpaciente = pu.idpaciente and pe.idpersona = pa.idpersona `);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const get_puntaje = async (req, res) => {
    try {
    
        const response = await pool.query(`
        select count(*), pu.puntaje  from puntajes pu group by  pu.puntaje;`);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
export const get_puntaje_total = async (req, res) => {
    try {
        
        const response = await pool.query(`
        select round(avg(puntaje),1),count(*) from puntajes`);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}




export const get_reingresos = async (req, res) => {
    try {
        
        const response = await pool.query(`select count(*) from historial_ingresos`);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}





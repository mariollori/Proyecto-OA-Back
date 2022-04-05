import { pool } from '../database'
export const getpac_asignados = async(req,res)=>{
    const idpersonal = req.params.id;
    try {
        const response = await pool.query(
        `select  distinct p.nombre,p.apellido,p.genero,c.descripcion, c.idpaciente,c.categoria,d.idasignacion,d.nro_atenciones,d.fecha
        from paciente c, persona p, personal_ayuda a, asignaciones d 
        where d.idpersonal=$1
              and d.estado = 'En Proceso'
              and d.idpaciente=c.idpaciente 
              and p.idpersona = c.idpersona;`,[idpersonal]);
              console.log(response.rows)

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}
    export const get_paciente_info = async(req,res)=>{
    const idpaciente = req.params.id;
    try {
        const response = await pool.query(
        `select   p.nombre,p.apellido,p.genero,p.telefono,p.edad,c.descripcion, c.origen,c.motivo,c.respuestas,c.categoria
        from paciente c, persona p 
        where c.idpaciente = $1
              and p.idpersona = c.idpersona `,[idpaciente]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}
export const get_atenciones_registradas = async(req,res)=>{
    const idasignacion = req.params.id;
    try {
        const response = await pool.query(
        `Select * from registro_atencion where idasignacion = $1 order by nro_sesion asc`,[idasignacion]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}


export const registrar_primera_atencion=async(req,res)=>{
    const {paciente,id,atencion} = req.body;

    try {
        const response = await  pool.query(    
        `update  paciente set  ciudad=$1,religion=$2,fecha_nacimiento=$3,grado_educacion=$4, ocupacion=$5,estado_civil = $6,nro_hijos=$7,problema_actual=$8,antecedentes = $9
        where idpaciente=$10`
        ,[paciente.ciudad,paciente.religion,paciente.fecha_nacimiento,paciente.grado_educacion,paciente.ocupacion,paciente.estado_civil,paciente.nro_hijos,paciente.problema_actual,paciente.antecedentes,paciente.idpaciente]);
        var f = new Date();
        const response2 = await  pool.query(`
        insert into registro_atencion(idasignacion,nro_sesion,observaciones,acciones_realizadas,conclusiones,recomendaciones,fecha_sesion,evidencia)
         values($1,$2,$3,$4,$5,$6,$7,$8) `
         ,[id,atencion.nro_sesion,atencion.observaciones,atencion.acciones_realizadas,atencion.conclusiones,atencion.recomendaciones,f,atencion.evidencia]);
        return res.status(200).json(` Atencio Registrada Correctamente`);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}
export const registrar_atencion=async(req,res)=>{
    const {atencion,id} = req.body;

    try {
        var f = new Date();
        const response = await  pool.query(`
        insert into registro_atencion(idasignacion,nro_sesion,observaciones,acciones_realizadas,conclusiones,recomendaciones,fecha_sesion,evidencia)
         values($1,$2,$3,$4,$5,$6,$7,$8) `
         ,[id,atencion.nro_sesion,atencion.observaciones,atencion.acciones_realizadas,atencion.conclusiones,atencion.recomendaciones,f,atencion.evidencia]);
               
        return res.status(200).json(` Atencin registrada correctamente`);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}

export const finalizar_atencion = async (req, res) => {
    try {
         
        const  idasignacion = req.params.id
        const motivo = req.body.motivo;
        const response = await pool.query(`update asignaciones set  estado='Finalizado',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
        return res.status(200).json(  `Se finalizo la atencion correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const cancelar_atencion = async (req, res) => {
    try {
        var f = new Date();
        const  idasignacion = req.params.id;
        const motivo = req.body.motivo;
        const response = await pool.query(`update asignaciones set  estado='Cancelado',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
        return res.status(200).json(  `Se cancelo la atencion correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const derivar_atencion_inmediata = async (req, res) => {
    try {
        var f = new Date();
        const  idasignacion = req.params.id;
        const motivo = req.body.motivo;
        const idpaciente = req.body.idpaciente;
        var idpersonal;
        const response = await pool.query(`update asignaciones set  estado='Cancelado',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
         idpersonal= await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='psicologo' and a.estado = 2 order by a.nro_pacientes  limit 1;`)
        if(idpersonal.rowCount == 0){
            idpersonal= await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='psicologo' and a.estado = 3  order by RANDOM() LIMIT 1 ;`)
        }
        await pool.query('INSERT INTO asignaciones(idpersonal,idpaciente,fecha,estado) values($1,$2,$3,$4)' ,[idpersonal.rows[0].idpersonal,idpaciente,f,'Derivada']);

      
        return res.status(200).json(  `Se derivo la atencion correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const derivar_atencion_finalizada = async (req, res) => {
    try {
        var f = new Date();
        const  idasignacion = req.params.id;
        const motivo = req.body.motivo;
        const idpaciente = req.body.idpaciente;
        var idpersonal;
        const response = await pool.query(`update asignaciones set  estado='Cancelado',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
         idpersonal= await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='psicologo' and a.estado = 2 order by a.nro_pacientes  limit 1;`)
        if(idpersonal.rowCount == 0){
            idpersonal= await pool.query(`select a.idpersonal from personal_ayuda a where a.tipo='psicologo' and a.estado = 3  order by RANDOM() LIMIT 1 ;`)
        }
        await pool.query('INSERT INTO asignaciones(idpersonal,idpaciente,fecha,estado) values($1,$2,$3,$4)' ,[idpersonal.rows[0].idpersonal,idpaciente,f,'Derivada']);

      
        
        return res.status(200).json(  `Se cancelo la atencion correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}










export const getnroregistros_pac = async(req,res)=>{
    const idasignacion = req.params.id;
    try {
        const response = await pool.query(
        `select count(*) from registro_atencion where idasignacion = $1 and estado=1`,[idasignacion]);
              console.log(response.rows)

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}

export const getlast_register = async(req,res)=>{
    const idasignacion = req.params.id;
    try {
        const response = await pool.query(
        `select idregistro_aten from registro_atencion where idasignacion = $1 and estado = '0' `,[idasignacion]);
              console.log(response.rows)

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
}



export const registraratencion_final = async (req, res) => {
    try {
         
        const  {atencion,id,derivacion,idpersonal}=req.body;
        const response = await pool.query('update registro_atencion set  condicion=$1,evidencia=$2 ,observaciones=$3 ,estado=$4, nro_sesion=$5 where idregistro_aten = $6', [atencion.condicion,atencion.evidencia,atencion.observaciones,1,atencion.nro_sesion,atencion.idregistro_aten]);
        const response2 = await pool.query(`update personal_ayuda set  estado=2 where idpersonal = $1`, [idpersonal]);
        if(derivacion){
            await pool.query(`update paciente set  estado='Derivado' where idpaciente = $1`, [id]);
           
        }else{
            await pool.query(`update paciente set  estado='Finalizado' where idpaciente = $1`, [id]);
        }
     
        return res.status(200).json(  `Atencion final registrada correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}






export const updateatencion=async(req,res)=>{
    const {fecha,id} = req.body;

    try {
        const response = await pool.query('update registro_atencion set  fecha_sesion=$1 where idregistro_aten = $2', 
        [fecha,id]);
               
        return res.status(200).json(`Fecha de  atencion actualizada`);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}



export const getatenciones_pend = async(req,res)=>{
    const idpersonal = req.params.id;
    try {
        const response = await pool.query(
            `select  distinct p.nombre,p.apellido, c.descripcion, ra.fecha_sesion,ra.hora,ra.idregistro_aten
            from paciente c, persona p, personal_ayuda a, asignaciones d , registro_atencion ra
            where d.idpersonal=$1
                  and d.idasignacion = ra.idasignacion
                  and ra.estado = 0
                  and d.idpaciente=c.idpaciente 
                  and c.estado = 'En Proceso'
                  and c.idpersona = p.idpersona;`,[idpersonal]);
              console.log(response.rows)

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}
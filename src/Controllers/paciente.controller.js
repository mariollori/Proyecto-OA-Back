import { pool } from '../database'
export const getpac_asignados = async(req,res)=>{
    const idpersonal = req.params.id;
    try {
        const response = await pool.query(
        `select  distinct p.nombre,p.apellido,p.genero,d.descripcion, c.idpaciente,d.categoria,d.idasignacion,d.nro_atenciones,d.fecha,d.respuestas,d.problema_actual,d.antecedentes
        from paciente c, persona p, personal_ayuda a, asignaciones d 
        where d.idpersonal=$1
              and d.estado = 'En Proceso'
              and d.idpaciente=c.idpaciente 
              and p.idpersona = c.idpersona;`,[idpersonal]);
           
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
        `select   p.nombre,p.apellido,p.genero,p.telefono,p.edad,a.descripcion, c.departamento,c.provincia,c.distrito,c.como_conocio,a.respuestas,a.categoria,c.ocupacion,c.idpaciente,
        c.religion,c.grado_educacion,c.estado_civil,c.nro_hijos,a.antecedentes,a.problema_actual,c.fecha_nacimiento,a.codex
        from paciente c, persona p ,asignaciones a
        where c.idpaciente = $1 and p.idpersona = c.idpersona and a.idpaciente = $1 and a.estado = 'En Proceso' `,[idpaciente]);
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
        `update  paciente set  religion=$1,fecha_nacimiento=$2,grado_educacion=$3, ocupacion=$4,estado_civil = $5,nro_hijos=$6
        where idpaciente=$7`
        ,[paciente.religion,paciente.fecha_nacimiento,paciente.grado_educacion,paciente.ocupacion,paciente.estado_civil,paciente.nro_hijos,paciente.idpaciente]);
        const response3 = await pool.query(`update asignaciones set problema_actual= $1 ,antecedentes = $2 where idasignacion = $3`,[paciente.problema_actual,paciente.antecedentes,id])
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
        var f = new Date();
        const  idasignacion = req.params.id
        const motivo = req.body.motivo;
    
        console.log(req.body);
        const response = await pool.query(`update asignaciones set  estado='Finalizado',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
      
        return res.status(200).json(  `Se finalizo la atencion correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const derivar_externo = async (req, res) => {
    try {
        var f = new Date();
        const  idasignacion = req.params.id
        const motivo = req.body.motivo;
    
        console.log(req.body);
        const response = await pool.query(`update asignaciones set  estado='Derivacion-Ext',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
      
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
        var sql = `select pa.idpersonal from  personal_ayuda pa, usuario u, usuario_rol ru , rol r where  pa.estado = $1  and u.idusuario =pa.idusuario  and ru.idusuario = u.idusuario and r.idrol = ru.idrol and r.nombre = $2 order by pa.nro_pacientes  limit 1;`;
        const {motivo,idpaciente,codex} = req.body
        const  idasignacion = req.params.id;
        var idpersonal;
        const data = await pool.query(`select descripcion,respuestas,categoria,antecedentes,problema_actual from asignaciones where idasignacion = $1`, [idasignacion]);
        const response = await pool.query(`update asignaciones set  estado='Derivacion-Psi',motivo = $1 where idasignacion= $2`, [motivo,idasignacion]);
         idpersonal= await pool.query(sql,[2,'Psicologo']);
        if(idpersonal.rowCount == 0){
            idpersonal= await pool.query(sql,[3,'Psicologo']);
        }
        await pool.query('INSERT INTO asignaciones(idpersonal,idpaciente,fecha,estado,descripcion,respuestas,antecedentes,problema_actual,categoria,nro_atenciones,codex) values($1,$2,$3,$4,$5,$6,$7,$8,$9,0,$10)' 
        ,[idpersonal.rows[0].idpersonal,idpaciente,f,'En Proceso',data.rows[0].descripcion,data.rows[0].respuestas, data.rows[0].antecedentes,data.rows[0].problema_actual,data.rows[0].categoria,codex]);

      
        return res.status(200).json(  `Se derivo la atencion correctamente`  );
    } catch (e) {
        
        return res.status(500).json('Error Interno...!');
    }
}



export const registrar_puntuacion = async (req, res) => {
    try {
        const { dni,puntaje,descripcion,codex} = req.body
        var f = new Date();
        const idpaciente = await pool.query(`select p.idpaciente,a.idpersonal from 
        paciente p,asignaciones a ,persona pe
        where pe.dni = $1 and p.idpersona = pe.idpersona and p.idpaciente = a.idpaciente and a.codex = $2 and a.estado ='Finalizado'`,[dni,codex])

        if(idpaciente.rowCount > 0){
            const punt = await pool.query(`select * from puntajes where codex = $1 `,[codex]);
            if(punt.rowCount > 0){
                return res.status(500).json( `Usted ya realizo la valoracion. Muchas Gracias por su participacion.`  );
            }else{
                await pool.query(`insert into puntajes(idpaciente,puntaje,descripcion,idpersonal,codex,fecha) values($1,$2,$3,$4,$5,$6)`,[idpaciente.rows[0].idpaciente,puntaje,descripcion,idpaciente.rows[0].idpersonal,codex,f]);
                return res.status(200).json(  `Se registro su valoracion, gracias por participar.`  );
            }
        }else{
            return res.status(500).json(  `Verifique si usted participo en nuestro servicio o termino su atencion.`  );
        }
       
    } catch (e) {
       
        return res.status(500).json('Error Interno...!');
    }
}
export const get_historial = async(req,res)=>{
    const idpaciente = req.params.id;
    try {
        const response = await pool.query(
        `select * from asignaciones  where idpaciente= $1 and estado != 'En Proceso' `,[idpaciente]);
        return res.status(200).json(response.rows);
    } catch (e) {
       
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}















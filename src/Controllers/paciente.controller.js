import { pool } from '../database'


export const getatenciones_pend = async(req,res)=>{
    const idpersonal = req.params.id;
    try {
        const response = await pool.query(
            `select  distinct p.nombre,p.apellido, c.descripcion, ra.fecha_sesion
            from paciente c, persona p, personal_ayuda a, asignaciones d , registro_atencion ra
            where d.idpersonal=$1
                  and d.idasignacion = ra.idasignacion
                  and ra.estado = 0
                  and d.idpaciente=c.idpaciente 
                  and c.estado = 'En proceso'
                  and c.idpersona = p.idpersona;`,[idpersonal]);
              console.log(response.rows)

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
 
 
 
}

export const getpac_asignados = async(req,res)=>{
    const idpersonal = req.params.id;
    try {
        const response = await pool.query(
        `select  distinct p.nombre,p.apellido,p.telefono,p.correo,p.genero, c.motivo,c.descripcion,c.edad, c.idpaciente,d.idasignacion
        from paciente c, persona p, personal_ayuda a, asignaciones d 
        where d.idpersonal=$1
              and d.idpaciente=c.idpaciente 
              and c.estado = 'En proceso'
              and c.idpersona = p.idpersona;`,[idpersonal]);
              console.log(response.rows)

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
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
         
        const  {atencion,id,derivacion}=req.body;
        const response = await pool.query('update registro_atencion set  condicion=$1,evidencia=$2 ,observaciones=$3 ,estado=$4, nro_sesion=$5 where idregistro_aten = $6', [atencion.condicion,atencion.evidencia,atencion.observaciones,1,atencion.nro_sesion,atencion.idregistro_aten]);

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


export const registraratencion_datos=async(req,res)=>{
    const {paciente,fecha,id,atencion} = req.body;

    try {
        const response = await  pool.query(    
        `update  paciente set  ciudad=$1,religion=$2,fecha_nacimiento=$3,
        grado_educacion=$4,edad=$5, ocupacion=$6
        where idpaciente=$7`
        ,[paciente.ciudad,paciente.religion,paciente.fecha_nacimiento,paciente.grado_educacion,paciente.edad,
            paciente.ocupacion,paciente.idpaciente]);
        var f = new Date();
        const response2 = await  pool.query(`
        insert into registro_atencion(idasignacion,nro_sesion,condicion,evidencia,observaciones,fecha_sesion,estado)
         values($1,$2,$3,$4,$5,$6,$7) `
         ,[id,atencion.nro_sesion,atencion.condicion,atencion.evidencia,atencion.observaciones,f,1]);
     
         const response3 =   await  pool.query('insert into registro_atencion(fecha_sesion,idasignacion,estado) values($1,$2,$3)   ',[fecha,id,0]);
        
               
        return res.status(200).json(` Atencio Registrada Correctamente`);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}

export const registraratencionnueva=async(req,res)=>{
    const {atencion,fecha,id} = req.body;

    try {
        const response = await pool.query('update registro_atencion set  condicion=$1,evidencia=$2 ,observaciones=$3 ,estado=$4, nro_sesion=$5 where idregistro_aten = $6', [atencion.condicion,atencion.evidencia,atencion.observaciones,1,atencion.nro_sesion,atencion.idregistro_aten]);

        const response2 =  await registrarfechaatencion(fecha,id);
               
        return res.status(200).json(` Atencin registrada correctamente`);
        
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }

}


 async function registrarfechaatencion(fecha,id){
    try {
        const response = await  pool.query('insert into registro_atencion(fecha_sesion,idasignacion,estado) values($1,$2,$3)   ',[fecha,id,0]);
        return true;
        
    } catch (e) {
    
        return false;
    }
}

import { pool } from '../database'

export const get_nombre_usuario = async(req,res)=>{
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select  p.nombre,p.apellido from persona p,personal_ayuda u  where u.idpersonal = $1 and u.idpersona= p.idpersona ', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const get_datos_usuario = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select p.idpersona, p.nombre,p.apellido,p.telefono,p.correo,p.genero,p.tipo,u.universidad,u.edad,u.ciclo,u.grupo,u.foto,u.especialidad,u.n_colegiatura,u.codigo from persona p ,personal_ayuda  u where u.idpersonal=$1 and u.idpersona=  p.idpersona ', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const get_datos_personales = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select p.idpersona, p.nombre,p.apellido,p.telefono,p.correo,p.genero from persona p ,personal_ayuda  u where u.idpersonal=$1 and u.idpersona=  p.idpersona ', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const get_datos_academicos = async (req, res) => {
    try {
        
        const id = parseInt(req.params.id);
        const tipo = await pool.query('select tipo from personal_ayuda where idpersonal =$1',[id]);
        var response;
        if(tipo.rows[0].tipo == 'estudiante'){
            response = await pool.query('select pa.foto,e.ciclo,e.grupo,e.codigo,pa.tipo from personal_ayuda pa,estudiante e  where pa.idpersonal=$1  and e.idpersonal=pa.idpersonal', [id]);
        }else if(tipo.rows[0].tipo == 'psicologo'){
            response = await pool.query('select pa.foto,p.n_colegiatura,p.grado_academico,p.especialidad,pa.tipo from personal_ayuda pa,psicologo p  where pa.idpersonal=$1 and p.idpersonal=pa.idpersonal ', [id]);
        }else{

        }
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const getuserstocompare = async (req, res) => {
    try {
        console.log('asdasd')
        const response = await pool.query('select username from usuario');
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json('asdasd');
    }
}




export const crearcancelacion = async (req, res) => {
    try {
        
        const {cancelacion,idpaciente,idpersonal}=req.body;
       
        var f = new Date();
        const response = await pool.query(`insert into cancelacion(motivo,fecha,idasignacion) values($1,$2,$3)`,
        [cancelacion.motivo,f,cancelacion.idasignacion]);

        const response2 = await pool.query(`update paciente set estado='Cancelado' where idpaciente=$1`,[idpaciente]);

        const response3 = await pool.query(`update personal_ayuda set estado=2 where idpersonal=$1`,[idpersonal]);
        return res.status(200).json('Se cancelo la solicitud de atencion.');

    } catch (e) {
        return res.status(500).json(e);
    }
}

export const modificar_datos_personales = async (req, res) => {
    try {
        const  {persona}=req.body;
        const valid = await pool.query('select pe.idpersona from personal_ayuda pa,persona pe  where pa.estado!=1 and  pa.idpersona = pe.idpersona   and pe.correo = $1', [persona.correo]);
        if(valid.rowCount == 0 ){
            const response = await pool.query('update persona set correo=$1,telefono=$2 where idpersona = $3',
            [persona.correo,persona.telefono,persona.idpersona]);
           return res.status(200).json(  `Datos personales guardados.`  );
        }else{
            if(valid.rows[0].idpersona == persona.idpersona){
                const response = await pool.query('update persona set correo=$1,telefono=$2 where idpersona = $3',
                [persona.correo,persona.telefono,persona.idpersona]);
               return res.status(200).json(  `Datos personales guardados.`  );
            }else{
                return res.status(500).json(  `Este correo ya se registro, por favor ingrese otro.`  );
            }
        }
     
     
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const modificarschooldata = async (req, res) => {
    try {
         
        const  {personal}=req.body;
        const response = await pool.query('update personal_ayuda set universidad=$1, edad=$2,ciclo=$3,grupo=$4,grado_academico=$5  where idpersonal = $6', 
        [personal.universidad,personal.edad,personal.ciclo,personal.grupo,personal.grado_academico,personal.idpersonal]);
        return res.status(200).json(  `Datos academicos guardados.`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}







export const loginpac=async(req,res)=>{
    const {nro_cita,dni} =req.body;
    try {
        const responesuser  = await pool.query(`select * from persona where dni=$1 and tipo = 'paciente'`,[dni]);
        if(responesuser.rows.length!=0){   
            console.log(responesuser.rows[0])     

            const idpersona= responesuser.rows[0].idpersona;
            const response2= await pool.query(`select * from paciente where idpersona=$1 and estado!='Cancelado' `,[idpersona])
            console.log(response2.rows[0])
            console.log(nro_cita)
            if(nro_cita === response2.rows[0].nro_cita){

                return res.status(200).json({idpersona:idpersona,idpaciente:response2.rows[0].idpaciente,nombre:responesuser.rows[0].nombre ,apellido:responesuser.rows[0].apellido})
            }else{
                return res.status(403).json('Paciente no existente!');
            }
        }else{
            return res.status(500).json('Paciente no existente')
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getasignaciondata = async (req, res) => {
    try {
        const idpaciente = parseInt(req.params.id);
        const response = await pool.query(
            `select pa.universidad,pa.idpersonal, p.nombre,p.apellido,p.telefono,p.correo,pa.foto
            from persona p, personal_ayuda pa, asignaciones a
            where a.idpaciente=$1 and
            a.idpersonal=pa.idpersonal and
            pa.idpersona = p.idpersona `, 
             [idpaciente]);
        return res.status(200).json(response.rows[0]);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}




export const getpersonadata = async (req, res) => {
    try {
        const idpersona = parseInt(req.params.id);
        const response = await pool.query(
            `select p.nombre,p.apellido,p.genero,p.tipo,p.idpersona,pa.estado from persona p,paciente pa where pa.idpersona=$1 and pa.idpersona=p.idpersona `, 
             [idpersona]);
        return res.status(200).json(response.rows[0]);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const getpuntuacionexis = async (req, res) => {
    try {
        const idpersona = parseInt(req.params.id);
        const response = await pool.query(
                        `select * from puntajes where idpaciente= $1`, 
             [idpersona]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const crearpuntuacion = async (req, res) => {
    try {
        const {idpaciente,idpersonal,puntaje} = req.body;
        const response = await pool.query(
                        `insert into puntajes(idpaciente,idpersonal,puntaje) values($1,$2,$3)`, 
             [idpaciente,idpersonal,puntaje]);
        return res.status(200).json('Valoracion registrada');
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const obtenerestadisticastotales_fecha = async (req, res) => {
    try {
        
        
        const fechai = req.query.fechai;
        const fechaf = req.query.fechaf;
        const tipo = req.query.tipo;
        
        const response = await pool.query(`
        select  pac.estado ,count(*)
        from paciente pac,personal_ayuda pa,persona p
        ,asignaciones asig
         where 
		 asig.fecha >= $1 and asig.fecha <= $2 and  asig.idpersonal = pa.idpersonal and  pa.idpersona=p.idpersona and p.tipo=$3
		 and asig.idpaciente = pac.idpaciente 
           group by pac.estado`, [fechai,fechaf,tipo]);
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
        const fechaf = req.query.fechaf;
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



export const obtenerestadisticas_fecha = async (req, res) => {
    try {
        console.log(req.query.id)
        const id = req.query.id;
        const fechai = req.query.fechai;
        const fechaf = req.query.fechaf;


        const response = await pool.query(`
        select  asig.estado ,count(*)
        from paciente p
        ,asignaciones asig
         where asig.idpersonal = $1 and
		 asig.fecha >= $2 and asig.fecha <= $3 and
		 asig.idpaciente = p.idpaciente
           group by asig.estado`, [id, fechai, fechaf]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

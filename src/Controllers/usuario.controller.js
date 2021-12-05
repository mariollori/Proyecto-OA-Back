import { pool } from '../database'



export const readUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select p.idpersona, p.nombre,p.apellido,p.telefono,p.correo,p.genero,p.tipo,u.universidad,u.edad,u.ciclo,u.grupo,u.foto from persona p ,personal_ayuda  u where u.idpersonal=$1 and u.idpersona=  p.idpersona ', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const getdatapersonal = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select  p.nombre,p.apellido,p.telefono,p.correo,p.genero,u.edad from persona p ,personal_ayuda  u where u.idpersonal=$1 and u.idpersona=  p.idpersona ', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const getdataschool = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select  p.idpersona,u.universidad,u.foto,u.edad,u.n_colegiatura,u.grado_academico,u.ciclo,u.grupo,u.especialidad,u.codigo,p.tipo from persona p ,personal_ayuda  u where u.idpersonal=$1 and u.idpersona=  p.idpersona ', [id]);
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

export const modificarpersonaldata = async (req, res) => {
    try {
         
        const  {persona}=req.body;
        const response = await pool.query('update persona set nombre=$1, apellido=$2,correo=$3,telefono=$4,genero=$5where idpersona = $6',
         [persona.nombre,persona.apellido,persona.correo,persona.telefono,persona.genero,persona.idpersona]);
        return res.status(200).json(  `Datos personales guardados.`  );
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
            `select pa.universidad,pa.idpersonal, p.nombre,p.apellido,p.telefono,p.correo
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
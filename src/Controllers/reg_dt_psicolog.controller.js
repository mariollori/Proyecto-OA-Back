import {pool} from '../database'



export const readDatospsicologoid = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const response = await pool.query('select pa.idpersonal, pe.nombre , pe.apellido , pe.correo , pa.edad , pe.telefono , pe.genero , pa.universidad , pa.grado_academico, pa.ciclo , pa.grupo , hr.dia_disponible , hr.hora_disponible , pa.estado from personal_ayuda pa , persona pe , horario_psicologo hr where  pa.idpersona = pe.idpersona and pa.idpersonal = hr.idpersonal and pa.idpersonal = $1', [id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e)
        return res.status(500).json('Internal Server error!');
    }
}



export const createDatoPsicologos = async (req, res) => {
    try {
        const { persona , personal_ayuda , horario } = req.body;
        const idpersona =  await pool.query('INSERT INTO persona (nombre , apellido , correo , telefono , genero) values ($1 , $2, $3 , $4 ,$5) returning  idpersona;',
            [persona.nombre , persona.apellido , persona.correo , persona.telefono , persona.genero]);
        
        const idpersonal =  await pool.query('INSERT INTO personal_ayuda (universidad , edad  , grado_academico , ciclo , grupo , idpersona, estado) values ($1, $2, $3 , $4 , $5 , $6 , 1) returning idpersonal;',
        [personal_ayuda.universidad , personal_ayuda.edad , personal_ayuda.grado_academico , personal_ayuda.ciclo , 
            personal_ayuda.grupo , idpersona.rows[0].idpersona]);

        
         await pool.query('INSERT INTO horario_psicologo ( dia_disponible , hora_disponible, idpersonal) values ( $1 , $2 , $3 );',
        [horario.dia_disponible , horario.hora_disponible , idpersonal.rows[0].idpersonal]);
    
        return res.status(200).json(
            `El psicologo ${persona.nombre}  ha sido regisrado correctamente!.`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error!');
    }
}

 // ACTUALIZAR 
export const  updateDatosPsicologo = async (req, res) => {
    try {
        const { persona , personal_ayuda , horario } = req.body;
        const response = await pool.query('UPDATE persona set nombre = $1 , apellido = $2 , correo = $3 ,telefono= $4 , genero = $5  where idpersona = $6;',
            [persona.nombre, persona.apellido, persona.correo, persona.telefono, persona.genero, persona.idpersona]);


         const response2 = await pool.query('UPDATE personal_ayuda set universidad = $1 , edad = $2 , grado_academico= $3 , ciclo = $4 , grupo=$5 , idpersona= $6 where idpersonal =$7;',
         [personal_ayuda.universidad, personal_ayuda.edad, personal_ayuda.grado_academico, personal_ayuda.ciclo, personal_ayuda.grupo, personal_ayuda.genero, personal_ayuda.idpersona]);

         const response3 = await pool.query('UPDATE horario_psicologo set hora_disponible = $1 , dia_disponible = $2 where idpersonal =$3',
         [horario.hora_disponible , horario.dia_disponible , horario.idpersonal]);

        return res.status(200).send(`El registro ${personal_ayuda.idpersonal} se ha sifo modificado.`);
    } catch (e) {
        console.log(e)
        return res.status(500).json('Ocurrio un Problemas en el servidor interno!.');
    }
}









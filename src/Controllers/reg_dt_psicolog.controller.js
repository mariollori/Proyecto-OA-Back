import { response } from 'express';
import {pool} from '../database'





export const createDatoPsicologos = async (req, res) => {
    try {
        const { persona , personal_ayuda , horario_psicologo } = req.body;


        const valid = await pool.query('select pe.nombre from personal_ayuda pa,persona pe  where pa.idpersona = pe.idpersona and pe.correo = $1', [persona.correo]);

        if(valid.rowCount > 0){
            return res.status(500).json(
                `Lo sentimos, este correo ya ha sido registrado, por favor registre uno diferente.`);
        }else{
            const idpersona =  await pool.query('INSERT INTO persona (nombre , apellido , correo , telefono , genero,edad) values ($1 , $2, $3 , $4 ,$5,$6) returning  idpersona;',
            [persona.nombre , persona.apellido , persona.correo , persona.telefono , persona.genero, persona.edad]);
            const idpersonal = await pool.query('INSERT INTO personal_ayuda(idpersona,estado,sede,tipo) values($1,$2,$3,$4) returning idpersonal',[idpersona.rows[0].idpersona,1,persona.sede,persona.tipo]);
            
            if(persona.tipo == 'estudiante'){
                const est =  await pool.query('INSERT INTO estudiante(ciclo , grupo  ,codigo , idpersonal) values ($1, $2, $3 , $4 )',
                [personal_ayuda.ciclo , personal_ayuda.grupo , personal_ayuda.codigo , idpersonal.rows[0].idpersonal]);
        
            }else{
                const psi =   await pool.query('INSERT INTO psicologo(grado_academico  ,n_colegiatura ,especialidad, idpersonal) values($1, $2, $3 , $4 )',
                [ personal_ayuda.grado_academico , personal_ayuda.n_colegiatura ,personal_ayuda.especialidad , idpersonal.rows[0].idpersonal]);
            }
     
           horario_psicologo.forEach(element => {
            const det =   pool.query('insert into horario_psicologo(idpersonal,dia,horaf,horai) values($1,$2,$3,$4)', [idpersonal.rows[0].idpersonal,element.dia, element.horaf,element.horai]);
            });
            return res.status(200).json(
                ` ${persona.nombre} sus datos de especialista han sido registrados. Porfavor espere a que se le envien sus credenciales a su correo.`);
        }

        
      
    
     
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error!');
    }
}


export const updatedataschool = async (req, res) => {
    try {
        const {  personal_ayuda,tipo } = req.body;
            if(tipo == 'estudiante'){
                const responseuser=  await pool.query('update  estudiante set ciclo=$1, grupo=$2, codigo=$3 where idpersonal = $4',
                [personal_ayuda.ciclo , personal_ayuda.grupo , personal_ayuda.codigo ,personal_ayuda.idpersonal]);
        
            }else if(tipo == 'psicologo'){
                const responseuser2=  await pool.query('update  psicologo set  grado_academico=$1  ,n_colegiatura =$2,especialidad =$3 where  idpersonal=$4',
                [personal_ayuda.grado_academico , personal_ayuda.n_colegiatura ,personal_ayuda.especialidad ,  personal_ayuda.idpersonal]);
            }else{
              
            }
    
      
    
        return res.status(200).json(
            ` Datos modificados correctamente.`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Internal Server error!');
    }
}
 // ACTUALIZAR 
export const  createhorario = async (req, res) => {
    try {
        const {  horario } = req.body;
         const response = await pool.query('insert into  horario_psicologo(dia,horai,horaf,idpersonal) values($1,$2,$3,$4)',
         [horario.dia,horario.horai,horario.horaf,horario.idpersonal]);

        return res.status(200).json('Nuevo Horario registrado.');
    } catch (e) {
        console.log(e)
        return res.status(500).json('Ocurrio un Problemas con el servidor interno!.');
    }
}

export const  deletehorario = async (req, res) => {
    try {
        const id = req.params.id;
         const response = await pool.query('delete from  horario_psicologo where idhorario=$1',
         [id]);

        return res.status(200).json('Horario Eliminado.');
    } catch (e) {
        console.log(e)
        return res.status(500).json('Ocurrio un Problemas con el servidor interno!.');
    }
}
export const  gethorariospsicologo = async (req, res) => {
    try {
        const id = req.params.id;
       

         const response = await pool.query('select * from  horario_psicologo where idpersonal= $1',
         [id]);

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e)
        return res.status(500).json('Ocurrio un Problemas con el servidor interno!.');
    }
}





export const  subirfoto = async (req, res) => {
    try {
        const {  id,foto } = req.body;
        const name_foto = await pool.query('select foto from personal_ayuda where idpersonal=$1',[id]);
        if(name_foto.rowCount == 0 ){
            const response = await pool.query('update  personal_ayuda set foto= $1 where idpersonal=$2',[foto,id]);
            return res.status(200).json('Foto actualizada.');
        }else{
            const response = await pool.query('update  personal_ayuda set foto= $1 where idpersonal=$2',[foto,id]);
            return res.status(200).json(name_foto.rows);
        }
         

        
    } catch (e) {
        console.log(e)
        return res.status(500).json('Ocurrio un Problemas con el servidor interno!.');
    }
}





// export const  get_estudiantes_5toaño = async (req, res) => {
//     try {
       
//          const response = await pool.query(  `select distinct  p.nombre,p.apellido,pa.sede, p.genero,p.correo,e.ciclo,e.codigo,e.grupo,pa.nro_pacientes
//          from personal_ayuda pa,
//          persona p,
//          estudiante e,
//          asignaciones a
//          where 
//          pa.idpersona = p.idpersona and e.idpersonal = pa.idpersonal
//          and a.idpersonal = pa.idpersonal and a.estado IN ('En Proceso','Finalizado')`);

//         return res.status(200).json(response.rows);
//     } catch (e) {
//         console.log(e)
//         return res.status(500).json('Ocurrio un Problemas con el servidor interno!.');
//     }
// }
import { pool } from '../database'

// <<------------------------OPCIONES------------------>>


export const get_opciones_por_rol = async (req, res) => {
    try {
        const opciones = [];
        const roles = JSON.parse(req.query['roles']);
        for (let index = 0; index < roles.length; index++) {
            const response = await pool.query('select o.nombre,o.idopcion,o.icono,o.ruta from opciones o,rol_opcion ro  where ro.idrol = $1 and o.idopcion = ro.idopcion', [roles[index]]);
            for (let index = 0; index < response.rows.length; index++) {
                opciones.push(response.rows[index]);
            }
        }
        let controlador = {};
        let opciones_filtradas = opciones.filter(function(op) {
            var exists = !controlador[op.nombre];  
            controlador[op.nombre] = true;
            return exists;
          });
        return res.status(200).json(opciones_filtradas);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const crearopcion = async (req, res) => {
    try {
         
        const  {opcion}=req.body;
        const response = await pool.query('insert into opciones(nombre,icono,ruta) values($1,$2,$3)', [opcion.nombre, opcion.icono,opcion.ruta]);
        return res.status(200).json(  `Opcion ${opcion.nombre} registrado correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const eliminaropcion = async (req, res) => {
    try {
         
        const  id= req.params.id;
        const response = await pool.query('delete from opciones where idopcion=$1', [ id]);
        return res.status(200).json(  `Opcion eliminada `  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const modificaropcion = async (req, res) => {
    try {
         
        const  {opcion}=req.body;
        const response = await pool.query('update opciones set nombre=$1, icono=$2,ruta=$3 where idopcion = $4', [opcion.nombre,opcion.icono,opcion.ruta,opcion.idopcion]);
        return res.status(200).json(  `Rol ${opcion.nombre} modificado correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const listaropciones = async (req, res) => {
    try {
        const response = await pool.query('select * from opciones');
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}



export const asignaropc_rol = async (req, res) => {
    try {
        const  {idopcion,idrol}=req.body;
        const response = await pool.query('insert into rol_opcion(idopcion,idrol) values($1,$2) ',[idopcion,idrol]);
        return res.status(200).json('Asignacion registrada.');
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const listaropcid = async (req, res) => {
    try {
        const id = req.params.id
        const response = await pool.query('select * from opciones where idopcion=$1',[id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

// <<------------------------ROLES------------------>>

export const crearrol = async (req, res) => {
    try {
         console.log(req.body)
        const  {nombre}=req.body;
        const response = await pool.query('insert into rol(nombre) values($1)', [nombre]);
        return res.status(200).json(  `Rol ${nombre} registrado correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const eliminarrol = async (req, res) => {
    try {
         
        const  id= req.params.id;
        const response = await pool.query('delete from rol where idrol=$1', [ id]);
        return res.status(200).json(  `Rol eliminado `  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const modificarrol = async (req, res) => {
    try {
         
        const  {nombre,idrol}=req.body;
        const response = await pool.query('update rol set nombre=$1 where idrol = $2', [nombre,idrol]);
        return res.status(200).json(  `Rol ${nombre} modificado correctamente`  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const listarrol = async (req, res) => {
    try {
        const response = await pool.query('select * from rol');
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const asignarrol_user = async (req, res) => {
    try {
        const  {idusuario,idrol}=req.body;
        const response = await pool.query('insert into usuario_rol(idusuario,idrol) values($1,$2) ',[idusuario,idrol]);
        return res.status(200).json('Asignacion registrada.');
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const listarrolid = async (req, res) => {
    try {
        const id = req.params.id
        const response = await pool.query('select * from rol where idrol=$1',[id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


// <<---------------------ROLES - OPCIONES - DIFERENTES------------------------------------->>

export const listaropcdisponibles = async (req, res) => {
    try {
        const idrol = req.params.id
        const response = await pool.query(' select  o.idopcion, o.nombre from opciones o where not exists (select o.idopcion ,o.nombre from   rol_opcion ro where ro.idrol= $1 and o.idopcion= ro.idopcion)   ',[idrol]);
        return res.status(200).json(response.rows);
     } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}



export const listarusuariosdisponibles = async (req, res) => {
    try {
        const id = req.params.id
        const response = await pool.query(' select  r.idrol, r.nombre from rol r where not exists (select r.idrol ,r.nombre from   usuario_rol ur where ur.idusuario= $1 and r.idrol= ur.idrol)  ',[id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const listarusuariospertenecientes = async (req, res) => {
    try {
        const id = req.params.id

      

        const response = await pool.query(' select ur.iduser_rol,ur.iduser_rol, r.idrol ,r.nombre from rol r,  usuario_rol ur where ur.idusuario= $1 and r.idrol= ur.idrol ',[id]);

        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


// <<<------------------- USUARIO ------------------------->>>
export const desactivar_usuario = async(req,res)=>{
    try {
        const idusuario = req.params.id;
        const response = await pool.query(`update usuario set estado = 0 where idusuario = $1 `,[idusuario]);
        const response2 = await pool.query(`update personal_ayuda set estado = 0 where idusuario = $1 `,[idusuario]);
        // estado = 0 =>> desactivado
        // estado = 1 =>> sin asignar
        // estado = 2 =>> activo
        // estado = 3 =>> ocupado
          // estado = 4 =>> cumplio xd
        return res.status(200).json('Exito al eliminar usuario.');
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const activar_usuario = async(req,res)=>{
    try {
        const idusuario = req.params.id;
        const response = await pool.query(`update usuario set estado = 1 where idusuario = $1 `,[idusuario]);
        const response2 = await pool.query(`update personal_ayuda set estado = 2 where idusuario = $1 `,[idusuario]);
        // estado = 0 =>> desactivado
        // estado = 1 =>> sin asignar
        // estado = 2 =>> activo
        // estado = 3 =>> ocupado
          // estado = 4 =>> cumplio xd
        return res.status(200).json('Exito al restaurar usuario.');
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}
export const listarusuarios = async (req, res) => {
    try {
        const {tipo,sede} = req.query;
        var response;
        // estado = 0 =>> desactivado
        // estado = 1 =>> sin asignar
        // estado = 2 =>> activo
        // estado = 3 =>> ocupado
        if(tipo=='psicologo'){
            response = await pool.query(
                `select u.idusuario,p.nombre,p.apellido,p.telefono,pr.tipo,p.correo,p.genero,ps.grado_academico,ps.n_colegiatura,ps.especialidad
                from personal_ayuda pr, persona p,usuario u, psicologo ps
                  where   pr.estado != 0 and pr.estado != 1 and pr.sede = $1  and pr.tipo = 'psicologo' and ps.idpersonal = pr.idpersonal and pr.idpersona = p.idpersona and u.idusuario = pr.idusuario ;`,[sede]);
        }else{
          response = await pool.query(
            `select u.idusuario,p.nombre,p.apellido,p.telefono,pr.tipo,p.correo,p.genero,e.ciclo,e.grupo,e.codigo
            from personal_ayuda pr, persona p ,usuario u,estudiante e
              where   pr.estado != 0 and pr.estado != 1 and pr.sede = $1  and pr.tipo = 'estudiante'and e.idpersonal = pr.idpersonal  and pr.idpersona = p.idpersona and u.idusuario = pr.idusuario ;`,[sede]);
        }
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

export const listarusuarios_tipo = async (req, res) => {
    try {
       
       const response= await pool.query(
        `select u.idusuario,p.nombre,p.apellido,p.telefono,pr.tipo,p.correo,pr.sede
        from personal_ayuda pr, persona p ,usuario u
          where  pr.estado = 0 and u.estado = 0   and pr.idpersona = p.idpersona and u.idusuario = pr.idusuario;`);;
        // estado = 0 =>> desactivado
        // estado = 1 =>> sin asignar
        // estado = 2 =>> activo
        // estado = 3 =>> ocupado
       
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const listaropcionesderol = async (req, res) => {
    try {
        const id = req.params.id
        const response = await pool.query(' select ro.idop_rol, o.idopcion ,o.nombre from opciones o,  rol_opcion ro where ro.idrol= $1 and o.idopcion= ro.idopcion ',[id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}



export const eliminarroldeusuario = async (req, res) => {
    try {
         
        const  id= req.params.id;
        const response = await pool.query('delete from usuario_rol where iduser_rol=$1', [id]);
        return res.status(200).json(  `Rol de usuario eliminado. `  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


export const eliminaropcionderol = async (req, res) => {
    try {
         
        const  id= req.params.id;
        const response = await pool.query('delete from rol_opcion where idop_rol=$1', [id]);
        return res.status(200).json(  `Opcion de rol eliminado `  );
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


import { pool } from '../database'

// <<------------------------OPCIONES------------------>>


export const findopciones = async (req, res) => {
    try {
         
       
        const opciones = [];
        const roles = JSON.parse(req.query['roles']);
        
        for (let index = 0; index < roles.length; index++) {
            console.log(roles[index]);
            const response = await pool.query('select o.nombre,o.idopcion,o.icono,o.ruta from opciones o,rol_opcion ro  where ro.idrol = $1 and o.idopcion = ro.idopcion', [roles[index]]);
            for (let index = 0; index < response.rows.length; index++) {

                opciones.push(response.rows[index]);
               }
               
               
        }
        let hash = {};
        let opa = opciones.filter(function(current) {
            var exists = !hash[current.nombre];
            console.log(!hash[current.nombre])
            hash[current.nombre] = true;
            return exists;
          });   
          console.log(hash)
        console.log(opa)
       
        return res.status(200).json( opa);
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
        const response = await pool.query(' select r.idrol ,r.nombre from rol r,  usuario_rol ur where ur.idusuario= $1 and r.idrol= ur.idrol ',[id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}


// <<<------------------- USUARIO ------------------------->>>
export const listarusuarios = async (req, res) => {
    try {
        const response = await pool.query('select p.nombre , p.apellido, u.username, u.idusuario from persona p ,personal_ayuda pa,usuario u where u.idpersonal = pa.idpersonal and pa.idpersona = p.idpersona');
        return res.status(200).json(response.rows);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno...!');
    }
}

import { pool } from '../database'


export const buscarpersonal = async (req, res) => {
    try {
        const tipo = req.query.tipo;
        
        const response = await pool.query(`
        select p.nombre, p.apellido,a.idpersonal,  a.estado,a.universidad,a.especialidad,
        p.telefono from persona p, personal_ayuda a where a.estado!=1 and a.estado!=0 and a.idpersona = p.idpersona and
		p.tipo =$1`, [tipo]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}

export const obtenerestadisticas = async (req, res) => {
    try {
        const id = req.params.id;
        
        const response = await pool.query(`
        select  p.estado ,count(*)
        from paciente p
        ,asignaciones asig
         where asig.idpersonal = $1 and asig.idpaciente = p.idpaciente
           group by p.estado`, [id]);
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
        select  p.estado ,count(*)
        from paciente p
        ,asignaciones asig
         where asig.idpersonal = $1 and
		 asig.fecha >= $2 and asig.fecha <= $3 and
		 asig.idpaciente = p.idpaciente
           group by p.estado`, [id,fechai,fechaf]);
        return res.status(200).json(response.rows);
    } catch (e) {
        return res.status(500).json(e);
    }
}
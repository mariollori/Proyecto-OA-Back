import { pool } from '../database'

export const creararchivo=async(req,res)=>{
    try {
   console.log(req.body)
        const  {nombre,tipo,idusuario}=req.body;
        const response = await   pool.query('insert into archivos(nombre,tipo,idusuario) values($1,$2,$3)', [nombre,tipo,idusuario]);
        return res.status(200).json(
            `El archivo   ${nombre } ha sido creada correctamente...!`);
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
}
export const getarchivo=async(req,res)=>{
    try {
     
        const  idusuario=req.params.id;
        const response = await   pool.query('select *  from archivos where idusuario=$1',
         [idusuario]);
        return res.status(200).json(response.rows)
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
}
export const deletearchivo=async(req,res)=>{
    try {
     
        const  idarchivo=req.params.id;
        const response = await   pool.query('delete from archivos where idarchivo=$1',
         [idarchivo]);
        return res.status(200).json('Eliminado correctamente')
    } catch (e) {
        console.log(e);
        return res.status(500).json('Error Interno....!');
    }
}
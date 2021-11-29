import { Router } from 'express'
import { checkToken } from '../auth/tokenValidation';
const router = Router();

import * as opciones_rol from '../Controllers/opciones.controller'


router.get('/getopciones/',checkToken,opciones_rol.findopciones);

router.get('/listarop/',checkToken,opciones_rol.listaropciones);
router.post('/crearop/',checkToken,opciones_rol.crearopcion);
router.delete('/eliminarop/:id',checkToken,opciones_rol.eliminaropcion);
router.put('/modificarop/',checkToken,opciones_rol.modificaropcion);
router.post('/asignarop/',checkToken,opciones_rol.asignaropc_rol);
router.get('/listaropid/:id',checkToken,opciones_rol.listaropcid);




router.get('/listarrol/',checkToken,opciones_rol.listarrol);
router.post('/crearrol/',checkToken,opciones_rol.crearrol);
router.delete('/eliminarrol/:id',checkToken,opciones_rol.eliminarrol);
router.put('/modificarrol/',checkToken,opciones_rol.modificarrol);

router.get('/listarrolid/:id',checkToken,opciones_rol.listarrolid);





router.get('/listaropcdisponibles/:id',checkToken,opciones_rol.listaropcdisponibles);


router.get('/listarrolesdisponibles/:id',checkToken,opciones_rol.listarusuariosdisponibles);
router.get('/listarrolesactuales/:id',checkToken,opciones_rol.listarusuariospertenecientes);
router.post('/asignarrol/',checkToken,opciones_rol.asignarrol_user);

router.get('/listarusers/',checkToken,opciones_rol.listarusuarios);
router.get('/listaropcionesactuales/:id',checkToken,opciones_rol.listaropcionesderol);


router.delete('/eliminaropcrol/:id',checkToken,opciones_rol.eliminaropcionderol);
router.delete('/eliminarroluser/:id',checkToken,opciones_rol.eliminarroldeusuario);


module.exports = router;
import { Router } from 'express'
const router = Router();

import * as asignacion from '../Controllers/asigancion.controller'

//ruta general
router.get('/get/estado', asignacion.buscarasignacion);

//RUTA Personal Ayuda
router.get('/personal_ayuda', asignacion.getpersonalayudadisponible);


module.exports = router;
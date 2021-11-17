import { Router } from 'express'
const router = Router();

import * as asignacion from '../Controllers/asigancion.controller'

//ruta general
router.get('/get/estado', asignacion.buscarasignacion);
//RUTA PASTOR
router.get('/pastor', asignacion.getPastor);
//RUTA ESTUDIANTE
router.get('/estudiante', asignacion.getEstudiante);
//RUTA PSICOLOGO
router.get('/psicologo', asignacion.getPsicologo);


module.exports = router;
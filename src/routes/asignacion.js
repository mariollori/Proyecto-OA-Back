import { Router } from 'express'
const router = Router();

import * as asignacion from '../Controllers/asigancion.controller'

//ruta general
router.get('/get/estado', asignacion.buscarasignacion);
router.get('/psi_asignado/:id', asignacion.get_Data_Psi_asignado);
router.get('/ultima_cond/:id', asignacion.get_ultima_observacion);
//RUTA Personal Ayuda
router.get('/personal_ayuda', asignacion.getpersonalayudadisponible);

//Asignar Paciente
router.post('/asignar_psi',asignacion.asignarpac_psi);
router.post('/asignar_est',asignacion.asignarpac_estud);


module.exports = router;
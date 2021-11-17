import { Router } from 'express'
import { checkToken } from '../auth/tokenValidation';
const router = Router();

import * as paciente from '../Controllers/paciente.controller'
router.get('/listatencion_pend/:id', checkToken,paciente.getatenciones_pend);
router.get('/listarpacasig/:id', checkToken,paciente.getpac_asignados);
router.get('/numeroregistros/:id', checkToken,paciente.getnroregistros_pac);
router.get('/getidatencion/:id', checkToken,paciente.getlast_register);
router.post('/registrardata1', checkToken,paciente.registraratencion_datos);
router.post('/registrardata2', checkToken,paciente.registraratencionnueva);
router.post('/registrardata3', checkToken,paciente.registraratencion_final);
module.exports = router;
import { Router } from 'express'
import { checkToken } from '../auth/tokenValidation';
const router = Router();

import * as bandeja from '../Controllers/bandeja.controller'


router.get('/get_asignacion_pendientes/:sede',checkToken,bandeja.get_asignaciones_pendientes);
router.get('/get_paciente/:id',checkToken,bandeja.get_paciente_data);
router.get('/get_personal/:id',checkToken,bandeja.get_personal_data);
router.put('/update_asignacion',checkToken,bandeja.update_asignacion__de_personal);
module.exports = router;
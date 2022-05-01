import { Router } from 'express'
import { checkToken } from '../auth/tokenValidation';
const router = Router();

import * as paciente from '../Controllers/paciente.controller'




/**Los q sirven por le momento xd */
router.get('/listarpacasig/:id', checkToken,paciente.getpac_asignados);
router.get('/paciente_info/:id',checkToken,paciente.get_paciente_info)
router.get('/atenciones_registradas/:id',checkToken,paciente.get_atenciones_registradas)
router.post('/registrardata1', checkToken,paciente.registrar_primera_atencion);
router.post('/registrardata2', checkToken,paciente.registrar_atencion);
router.post('/finalizar_atencion/:id', checkToken,paciente.finalizar_atencion);
router.post('/derivar_externo/:id', checkToken,paciente.derivar_externo);
router.post('/cancelar_atencion/:id', checkToken,paciente.cancelar_atencion);
router.post('/derivar_atencion/:id', checkToken,paciente.derivar_atencion_inmediata);

router.post('/registrar_valoracion',paciente.registrar_puntuacion);
router.get('/get_historial/:id',checkToken,paciente.get_historial)



module.exports = router;
import { Router } from 'express'
import { checkToken } from '../auth/tokenValidation';
const router = Router();

import * as paciente from '../Controllers/paciente.controller'
router.get('/listatencion_pend/:id', checkToken,paciente.getatenciones_pend);

router.get('/numeroregistros/:id', checkToken,paciente.getnroregistros_pac);
router.get('/getidatencion/:id', checkToken,paciente.getlast_register);
router.put('/updatefecha',checkToken,paciente.updateatencion);

router.post('/registrardata3', checkToken,paciente.registraratencion_final);


/**Los q sirven por le momento xd */
router.get('/listarpacasig/:id', checkToken,paciente.getpac_asignados);
router.get('/paciente_info/:id',checkToken,paciente.get_paciente_info)
router.get('/atenciones_registradas/:id',checkToken,paciente.get_atenciones_registradas)
router.post('/registrardata1', checkToken,paciente.registrar_primera_atencion);
router.post('/registrardata2', checkToken,paciente.registrar_atencion);
router.post('/finalizar_atencion/:id', checkToken,paciente.finalizar_atencion);
router.post('/cancelar_atencion/:id', checkToken,paciente.cancelar_atencion);
router.post('/derivar_atencion/:id', checkToken,paciente.derivar_atencion_inmediata);
router.post('/derivar_atencion_finalizada/:id', checkToken,paciente.derivar_atencion_finalizada);



module.exports = router;
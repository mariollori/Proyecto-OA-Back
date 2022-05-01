import { Router } from 'express'
const router = Router();
import { checkToken } from '../auth/tokenValidation';

import * as psico from '../Controllers/psicologo.controller'







router.get('/getsolpsi',checkToken,psico.list_personal_sede);
router.post('/crearusuario',checkToken,psico.crearusuariooa);
router.post('/deletepersona',checkToken,psico.deletesolicitud);
router.post('/crearmensaje',psico.crearmensaje)



module.exports = router;
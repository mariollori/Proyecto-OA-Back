import { Router } from 'express'
const router = Router();

import * as psico from '../Controllers/psicologo.controller'






router.get('/getsolpsi',psico.listarpsicologosdes);

router.post('/crearusuario',psico.crearusuariooa);
router.post('/deletepersona',psico.deletesolicitud);
router.post('/crearmensaje',psico.crearmensaje)



module.exports = router;
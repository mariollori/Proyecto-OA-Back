import { Router } from 'express'
const router = Router();

import * as psico from '../Controllers/psicologo.controller'






router.get('/getsolpsi',psico.listarpsicologosdes);

router.post('/crearusuario',psico.crearusuariooa);




module.exports = router;
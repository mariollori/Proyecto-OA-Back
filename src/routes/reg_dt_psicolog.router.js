import { Router } from 'express'
const router = Router();

import * as psicologo_reg from '../Controllers/reg_dt_psicolog.controller'

router.get('/datospsicologo/:id',psicologo_reg.readDatospsicologoid);
router.post('/register/dato_psicogolo',psicologo_reg.createDatoPsicologos);
router.put('/update/dato_psicogolo',psicologo_reg.updateDatosPsicologo);


module.exports = router;
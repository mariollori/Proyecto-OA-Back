import { Router } from 'express'
const router = Router();

import * as psicologo_reg from '../Controllers/reg_dt_psicolog.controller'

router.get('/datospsicologo/:id',psicologo_reg.readDatospsicologoid);
router.post('/register/dato_psicogolo',psicologo_reg.createDatoPsicologos);
router.get('/horarios/:id',psicologo_reg.gethorariospsicologo);
router.put('/update/dataschool',psicologo_reg.updatedataschool);

router.put('/update/foto',psicologo_reg.subirfoto);
router.post('/horario/post',psicologo_reg.createhorario);
router.delete('/horario/delete/:id',psicologo_reg.deletehorario);

module.exports = router;
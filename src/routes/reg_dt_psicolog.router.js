import { Router } from 'express'
const router = Router();

import * as psicologo_reg from '../Controllers/reg_dt_psicolog.controller'

router.post('/register/dato_psicogolo',psicologo_reg.createDatoPsicologos);
router.get('/horarios/:id',psicologo_reg.gethorariospsicologo);
router.put('/update/dataschool',psicologo_reg.updatedataschool);

router.put('/update/foto',psicologo_reg.subirfoto);
router.post('/horario/post',psicologo_reg.createhorario);
router.delete('/horario/delete/:id',psicologo_reg.deletehorario);
// router.get('/5to',psicologo_reg.get_estudiantes_5toaño);
module.exports = router;
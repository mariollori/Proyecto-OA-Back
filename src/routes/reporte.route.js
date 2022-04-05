import { Router } from 'express'
const router = Router();

import * as reports from '../Controllers/reporte.controller'
import { checkToken } from '../auth/tokenValidation';

router.get('/buscarpersonal/tipo',checkToken,reports.buscarpersonal);
router.get('/buscarpersonal/sede',checkToken,reports.buscarpersonal_sede);
router.get('/estadisticas/fecha',checkToken,reports.obtenerestadisticas_fecha);

router.get('/info_personal',checkToken,reports.personal_by_id);
router.get('/estadisticas/genero/:genero',checkToken,reports.obtenerestadisticas_genero);
router.get('/estadistica/:id',reports.obtenerestadisticas);


router.get('/estadisticastotales/tipo',checkToken,reports.estadisticas_generales_tipo_sede);
router.get('/estadisticastotales/fecha',checkToken,reports.estadisticas_generales_tipo_sede_fecha);





router.get('/get_atenciones/:id',reports.get_atenciones_by_id);
router.get('/get_pacientes/:id',reports.get_asignaciones_by_id);

module.exports = router;
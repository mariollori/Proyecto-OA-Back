import { Router } from 'express'
const router = Router();

import * as reports from '../Controllers/reporte.controller'
import { checkToken } from '../auth/tokenValidation';

router.get('/buscarpersonal/tipo',checkToken,reports.buscarpersonal);
router.get('/buscarpersonal/sede',checkToken,reports.buscarpersonal_sede);
router.get('/buscarpersonal_4/sede',checkToken,reports.buscar_personal_menor_4);

router.get('/info_personal',checkToken,reports.personal_by_id);
router.get('/estadisticas/genero/:genero',checkToken,reports.obtenerestadisticas_genero);
router.get('/estadistica/:id',checkToken,reports.obtenerestadisticas);


router.get('/estadisticastotales/tipo',checkToken,reports.estadisticas_generales_tipo_sede);
router.get('/estadisticastotales/fecha',checkToken,reports.estadisticas_generales_tipo_sede_fecha);





router.get('/get_atenciones/:id',checkToken,reports.get_atenciones_by_id);
router.get('/get_pacientes/:id',checkToken,reports.get_asignaciones_by_id);
router.get('/get_comentarios/:id',checkToken,reports.get_comentarios_by_id);

router.get('/get_puntaje/:id',checkToken,reports.get_puntaje_by_id);
router.get('/get_puntaje_total/:id',checkToken,reports.get_puntaje_total_by_id);


router.get('/get_comentarios_totales',checkToken,reports.get_comentarios);

router.get('/get_puntaje_totales',checkToken,reports.get_puntaje);
router.get('/get_puntaje_totales_by_star',checkToken,reports.get_puntaje_total);
router.get('/get_reingresos',checkToken,reports.get_reingresos);
module.exports = router;
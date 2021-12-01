import { Router } from 'express'
const router = Router();

import * as reports from '../Controllers/reporte.controller'


router.get('/buscarpersonal/tipo',reports.buscarpersonal)

router.get('/estadisticas/fecha',reports.obtenerestadisticas_fecha)


router.get('/estadistica/:id',reports.obtenerestadisticas)
module.exports = router;
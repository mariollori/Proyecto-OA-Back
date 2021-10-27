import { Router } from 'express'
const router = Router();

import * as persona from '../Controllers/persona.controllers'



router.post('/postuser',persona.crearuser);

router.post('/enviarcorreo',persona.enviarcorreo);

router.get('/getcorreos/:id',persona.getcorreos);



router.post('/postpaciente',persona.crearpaciente);

module.exports = router;
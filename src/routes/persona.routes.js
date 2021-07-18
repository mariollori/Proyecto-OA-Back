import { Router } from 'express'
const router = Router();

import * as persona from '../Controllers/persona.controllers'

router.get('/getpersonas', persona.obtenerpersonas);

router.post('/postuser',persona.crearuser);
router.get('/allpersona/:estado',persona.obtenerpersonas);
router.post('/enviarcorreo',persona.enviarcorreo);

router.get('/getcorreos/:id',persona.getcorreos);




module.exports = router;
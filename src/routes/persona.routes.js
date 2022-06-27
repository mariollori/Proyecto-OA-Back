import { Router } from 'express'
const router = Router();

import * as persona from '../Controllers/persona.controllers'











router.post('/postpaciente',persona.crearpaciente);

module.exports = router;
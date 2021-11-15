import { Router } from 'express'
const router = Router();

import * as archivo from '../Controllers/archivo.controller'



router.post('/post',archivo.creararchivo);

router.get('/get/:id',archivo.getarchivo);

router.delete('/borrar/:id',archivo.deletearchivo);


module.exports = router;
import { Router } from 'express'
const router = Router();

import * as usuario from '../Controllers/usuario.controller'
const { checkToken } = require('../auth/tokenValidation');

router.get('/:id',checkToken, usuario.readUser);

router.post('/', usuario.createUser);



module.exports=router
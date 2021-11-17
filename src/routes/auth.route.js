import { Router } from 'express'
const router = Router();

import * as auth from '../Controllers/auth.controller'



router.post('/login',auth.login);





module.exports = router;
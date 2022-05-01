import { Router } from 'express'
const router = Router();

import * as auth from '../Controllers/auth.controller'



router.post('/login',auth.login);

router.put('/forgote-password',auth.forgot_password);

router.put('/change-password',auth.change_password)



module.exports = router;
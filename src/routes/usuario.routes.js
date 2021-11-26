import { Router } from 'express'
import * as usuario from '../Controllers/usuario.controller'
const router = Router();


const { checkToken } = require('../auth/tokenValidation');

router.get('/:id',checkToken, usuario.readUser);

router.get('/dataasig/:id', usuario.getasignaciondata);
router.get('/persondata/:id', usuario.getpersonadata);
router.post('/crearcancelacion/post',checkToken, usuario.crearcancelacion);


router.get('/getuserstocompare/getdata',checkToken, usuario.getuserstocompare);

router.put('/putdataper',checkToken, usuario.modificarpersonaldata);
router.put('/putdatasch',checkToken, usuario.modificarschooldata);


router.post('/loginpac',usuario.loginpac)
module.exports=router
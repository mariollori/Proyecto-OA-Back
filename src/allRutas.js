
const express = require('express');
const appe = express();


const persona = require('./routes/persona.routes')
appe.use('/persona',persona)

const reporte = require('./routes/reporte.route')
appe.use('/reporte',reporte)

const usuario = require('./routes/usuario.routes')
appe.use('/usuario',usuario)

const auth = require('./routes/auth.route')
appe.use('/auth',auth)


const opciones = require('./routes/opciones.route')
appe.use('/opcion', opciones)



const datos_psicologo = require('./routes/reg_dt_psicolog.router')
appe.use('/datos_psicologo', datos_psicologo)


const paciente= require('./routes/paciente.route')
appe.use('/paciente', paciente)

const bandeja= require('./routes/bandeja.route')
appe.use('/bandeja',bandeja)



const psi= require('./routes/psicologo.route')
appe.use('/psicologo', psi)
module.exports = appe;


import express, { Router } from "express";
const appe = express();


const persona = require('./routes/persona.routes')
appe.use('/persona',persona)


const usuario = require('./routes/usuario.routes')
appe.use('/usuario',usuario)

const auth = require('./routes/auth.route')
appe.use('/auth',auth)

const archivo = require('./routes/archivo.route')
appe.use('/archivo',archivo)
module.exports = appe;

const opciones = require('./routes/opciones.route')
appe.use('/opcion', opciones)


//ASIGNACIONES

const asignacion = require('./routes/asignacion')
appe.use('/asignacion', asignacion)


const datos_psicologo = require('./routes/reg_dt_psicolog.router')
appe.use('/datos_psicologo', datos_psicologo)


const paciente= require('./routes/paciente.route')
appe.use('/paciente', paciente)


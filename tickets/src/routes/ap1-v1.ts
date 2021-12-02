import { newTicketValidation, updateTicketValidation } from './../validations'
import { requireAuth, validateRequest } from '@wymaze/common'
import express from 'express'
import { newTicket, showTicket, allTickets, updateTicket } from '../controllers'

const router = express.Router()

router.post('/new-ticket',
  requireAuth,
  newTicketValidation,
  validateRequest,
  newTicket)

router.get('/:id',
  showTicket)

router.get('/',
  allTickets)

router.put('/update-ticket/:id',
  requireAuth,
  updateTicketValidation,
  validateRequest,
  updateTicket)


export { router as apiV1Router }
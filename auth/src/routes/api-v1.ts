import { currentUser, validateRequest } from '@wymaze/common';
import express from 'express'
import { signupValidation, signinValidation } from './../validations'
import { signupCtrl, signinCtrl, signoutCtrl, currentUserCtrl } from '../controllers'

const router = express.Router()

router.post('/signup', signupValidation, validateRequest, signupCtrl)
router.post('/signin', signinValidation, validateRequest, signinCtrl)
router.post('/signout', signoutCtrl)
router.get('/current-user', currentUser, currentUserCtrl)

export { router as apiV1Router }
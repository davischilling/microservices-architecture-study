import { Encripter } from './../utils/encripter'
import { BadRequestError } from '@wymaze/common'
import { Request, Response } from 'express'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

export const signinCtrl = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    throw new BadRequestError('Invalid Credentials')
  }

  const passwordsMatch = await Encripter.compare(existingUser.password, password)
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials')
  }

  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!)

  req.session = {
    jwt: userJwt
  }

  res.status(200).send(existingUser)
}
import { Request, Response } from 'express'

export const signoutCtrl = async (req: Request, res: Response) => {
  req.session = null

  res.send({})
}
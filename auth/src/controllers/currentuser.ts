import { Request, Response } from 'express'

export const currentUserCtrl = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null })
}
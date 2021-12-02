import mongoose from 'mongoose'

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: mongoose.Types.ObjectId().toHexString()
    })
  }
}
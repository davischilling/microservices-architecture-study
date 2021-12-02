import { stripe } from './../stripe'
import { Order } from '../models/Order'
import { BadRequestError, NotFoundError, OrderStatus } from '@wymaze/common'
import { Request, Response } from 'express'
import { Payment } from '../models/Payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created'
import { natsWrapper } from '../nats-wrapper'

export const newPayment = async (req: Request, res: Response) => {
  const { token, orderId } = req.body

  const order = await Order.findById(orderId)

  if (!order) {    
    throw new NotFoundError()
  }

  if (order.userId !== req.currentUser.id) {    
    throw new NotFoundError()
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for an cancelled order ')
  }

  const charge = await stripe.charges.create({
    currency: 'eur',
    amount: order.price * 100,
    source: token
  })

  const payment = Payment.build({
    orderId: order.id,
    stripeId: charge.id
  })

  await payment.save()

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  })

  res.status(201).send(payment)
}
import Stripe from 'stripe'

export const stripe = new Stripe(
  process.env.STRIPE_KEY,
  '2020-08-27'
)
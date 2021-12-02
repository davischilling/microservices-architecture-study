import { Publisher, Subjects, OrderCancelledEvent } from '@wymaze/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
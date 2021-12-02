import { Publisher, Subjects, PaymentCreatedEvent } from '@wymaze/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
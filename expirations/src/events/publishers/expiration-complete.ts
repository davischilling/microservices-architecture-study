import { Publisher, ExpirationCompleteEvent, Subjects } from '@wymaze/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
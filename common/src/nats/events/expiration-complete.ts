import { Subjects } from '../configs/subjects'

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete
  data: {
    orderId: string
  }
}
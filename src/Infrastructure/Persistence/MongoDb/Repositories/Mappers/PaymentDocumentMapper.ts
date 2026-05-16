import type { Document } from "@mongodb";
import {
  Payment,
  PaymentMethod,
  CardNumber,
  ExpiryDate,
  CVV,
  PaymentAmount,
  ExternalId,
  PaymentId,
  PaymentStatusState,
  PaymentMethodType,
  PaymentStatus,
} from "@/Domain/Ticketing/Payments/mod.ts";
import { OrderId, BookingId } from "@/Domain/Ticketing/Orders/mod.ts";
import { type DocumentMapper } from "@/Infrastructure/Persistence/MongoDb/Shared/mod.ts";

interface PaymentDocumentShape {
  _id?: string;
  id?: string;
  paymentMethod: PaymentMethodType;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  orderId: string;
  bookingId: string;
  amount: number;
  status: PaymentStatusState;
  externalId: string;
}
export class PaymentDocumentMapper implements DocumentMapper<Payment> {
  toDocument(aggreagate: Payment): Document {
    return {
      _id: aggreagate.id.toString(),
      id: aggreagate.id.toString(),
      paymentMethod: aggreagate.paymentMethod.value,
      cardNumber: aggreagate.cardNumber.value,
      expiryDate: aggreagate.expiryDate.value,
      cvv: aggreagate.cvv.value,
      orderId: aggreagate.orderId.toString(),
      bookingId: aggreagate.bookingId.toString(),
      amount: aggreagate.amount.value,
      status: aggreagate.status.value,
      externalId: aggreagate.externalId.value,
    };
  }
  reconstitute(document: Document): Payment {
    // Implementation for reconstituting a Payment object from a document
    const snapshot = document as unknown as PaymentDocumentShape;

    const payment = Object.create(Payment.prototype) as {
      _id?: PaymentId;
      paymentMethod: PaymentMethod;
      cardNumber: CardNumber;
      expiryDate: ExpiryDate;
      cvv: CVV;
      orderId: OrderId;
      bookingId: BookingId;
      amount: PaymentAmount;
      status: PaymentStatus;
      externalId: ExternalId;
      _domainEvents: unknown[];
    };
    payment._id = PaymentId.create((snapshot._id ?? snapshot.id) as string);
    payment.paymentMethod = PaymentMethod.create(snapshot.paymentMethod);
    payment.cvv = CVV.create(snapshot.cvv);
    payment.cardNumber = CardNumber.create(snapshot.cardNumber);
    payment.expiryDate = ExpiryDate.create(snapshot.expiryDate);
    payment.orderId = OrderId.create(snapshot.orderId);
    payment.bookingId = BookingId.create(snapshot.bookingId);
    payment.amount = PaymentAmount.create(snapshot.amount);
    payment.status = PaymentStatus.create(snapshot.status);
    payment.externalId = ExternalId.create(snapshot.externalId);
    payment._domainEvents = [];

    return payment as unknown as Payment;
  }
}

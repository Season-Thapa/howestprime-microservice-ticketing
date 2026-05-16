import type { Document } from '@mongodb';
import type {
    Payment,
    PaymentMethod,
    CardNumber,
    ExpiryDate,
    CVV,
    PaymentAmount,
    ExternalId
} from 'Mtg.Tournaments/Domain/Payments/mod.ts';
import { OrderId,BookingId } from "@/Domain/Ticketing/Orders/mod.ts";
import { type DocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import {PaymentId} from "../../../../../Domain/Ticketing/Payments/Payment.ts";
import {PaymentStatus} from "../../../../../Domain/Ticketing/Payments/ValueObjects/PaymentStatus.ts";

interface PaymentDocumentShape {
    _id?: string;
    id?: string;
    paymentMethod : string,
    cardNumber : number,
    expiryDate : string,
    cvv : number,
    orderId : string,
    bookingId : string,
    amount : number,
    status : string,
    externalId : string,
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
            status: aggreagate.status,
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
        payment._id = PaymentId.create((snapshot.id ?? snapshot.id) as string);
        payment.paymentMethod = PaymentMethod.create(snapshot.paymentMethod);

    }
}

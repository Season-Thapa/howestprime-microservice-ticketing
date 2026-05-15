import { Entity, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { ExternalId } from './ValueObjects/ExternalId.ts';
import { PaymentMethod } from './ValueObjects/PaymentMethod.ts';
import { CardNumber } from './ValueObjects/CardNumber.ts';
import { ExpiryDate } from './ValueObjects/ExpiryDate.ts';
import { CVV } from './ValueObjects/CVV.ts';
import { OrderId } from '../Orders/Order.ts';
import { BookingId } from '../Orders/ValueObjects/BookingId.ts';
import {
    PaymentStatus,
    PaymentStatusState,
} from '@/Domain/Ticketing/Payments/ValueObjects/PaymentStatus.ts';
import { PaymentAmount } from './ValueObjects/PaymentAmount.ts';
import { FailureReason } from './ValueObjects/FailureReason.ts';

export class PaymentId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(value?: string): PaymentId {
        return new PaymentId(value);
    }
}

export class Payment extends Entity<PaymentId> {
    private _externalId: ExternalId | null;
    private readonly _paymentMethod: PaymentMethod;
    private readonly _cardNumber: CardNumber;
    private readonly _expiryDate: ExpiryDate;
    private readonly _cvv: CVV;
    private readonly _orderId: OrderId;
    private readonly _bookingId: BookingId;
    private readonly _amount: PaymentAmount;
    private _status: PaymentStatus;

    private constructor(
        id: PaymentId,
        paymentMethod: PaymentMethod,
        cardNumber: CardNumber,
        expiryDate: ExpiryDate,
        cvv: CVV,
        orderId: OrderId,
        bookingId: BookingId,
        amount: PaymentAmount,
        status: PaymentStatus,
        externalId: ExternalId | null = null,
    ) {
        super(id);
        this._externalId = externalId;
        this._paymentMethod = paymentMethod;
        this._cardNumber = cardNumber;
        this._expiryDate = expiryDate;
        this._cvv = cvv;
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._amount = amount;
        this._status = status;
        this._externalId = externalId;
    }

    static create(
        paymentMethod: PaymentMethod,
        cardNumber: CardNumber,
        expiryDate: ExpiryDate,
        cvv: CVV,
        orderId: OrderId,
        bokingId: BookingId,
        amount: PaymentAmount,
    ): Payment {
        const payment = new Payment(
            PaymentId.create(),
            paymentMethod,
            cardNumber,
            expiryDate,
            cvv,
            orderId,
            bokingId,
            amount,
            PaymentStatus.create(PaymentStatusState.Pending),
            null,
        );
        return payment;
    }

    public markAsSuccess(externalId: ExternalId): void {
        // Assuming your PaymentStatus has a getter for the state value underneath
        if (this._status.value !== PaymentStatusState.Pending) {
            throw new Error('A payment can only be marked as succeeded when it is still pending.');
        }
        this._status = PaymentStatus.create(PaymentStatusState.Success);
        this._externalId = externalId;
    }

    public markAsFailed(reason: FailureReason): void {
        if (this._status.value !== PaymentStatusState.Pending) {
            throw new Error('A payment can only be marked as failed when it is still pending.');
        }
        this._status = PaymentStatus.create(PaymentStatusState.Failed);
        reason == reason || FailureReason.create('Unknown failure reason');
    }
    get paymentMethod(): PaymentMethod {
        return this._paymentMethod;
    }

    get cardNumber(): CardNumber {
        return this._cardNumber;
    }

    get expiryDate(): ExpiryDate {
        return this._expiryDate;
    }

    get cvv(): CVV {
        return this._cvv;
    }

    get orderId(): OrderId {
        return this._orderId;
    }

    get bookingId(): BookingId {
        return this._bookingId;
    }

    get amount(): PaymentAmount {
        return this._amount;
    }

    get status(): PaymentStatus {
        return this._status;
    }

    get externalId(): ExternalId | null {
        return this._externalId;
    }
}

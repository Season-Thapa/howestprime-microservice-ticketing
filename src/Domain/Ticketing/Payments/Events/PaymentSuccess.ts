import { EventFQDN } from '@/Domain/Shared/DomainEvents/EventFQDN.ts';
import { PaymentDomainEvent } from './PaymentDomainEvent.ts';

export class PaymentSuccess extends PaymentDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${PaymentDomainEvent.FQDN_PREFIX}.success`,
    );

    private readonly _paymentId: string;
    private readonly _orderId: string;
    private readonly _bookingId: string;
    private readonly _occurredOn: Date;

    private constructor(
        paymentId: string,
        orderId: string,
        bookingId: string,
    ) {
        super();
        this._paymentId = paymentId;
        this._orderId = orderId;
        this._bookingId = bookingId;
        this._occurredOn = new Date();
    }
    static create(
        paymentId: string,
        orderId: string,
        bookingId: string,
    ): PaymentSuccess {
        return new PaymentSuccess(
            paymentId,
            orderId,
            bookingId,
        );
    }
    get paymentId(): string {
        return this._paymentId;
    }
    get orderId(): string {
        return this._orderId;
    }
    get bookingId(): string {
        return this._bookingId;
    }
    get occurredOn(): Date {
        return this._occurredOn;
    }
    override get FQDN(): EventFQDN {
        return PaymentSuccess.FQDN;
    }
}

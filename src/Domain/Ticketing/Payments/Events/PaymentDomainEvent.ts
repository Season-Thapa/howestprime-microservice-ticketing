import { type DomainEvent, EventFQDN } from '@/Domain/Shared/mod.ts';

export abstract class PaymentDomainEvent implements DomainEvent {
    protected static readonly FQDN_PREFIX = 'howestprime.ticketing.payments';

    abstract get FQDN(): EventFQDN;
    abstract get occurredOn(): Date;
}

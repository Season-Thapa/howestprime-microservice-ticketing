import {type DomainEvent,EventFQDN} from "@/Domain/Shared/mod.ts";

export abstract class BookingDomainEvent implements DomainEvent {
    protected static readonly FQDN_PREFIX = 'howestprime.ticketing.bookings';

    abstract get FQDN(): EventFQDN;
    abstract get occurredOn(): Date;
}

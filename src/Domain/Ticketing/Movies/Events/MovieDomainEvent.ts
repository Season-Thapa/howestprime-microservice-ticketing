import {type DomainEvent,EventFQDN} from "@/Domain/Shared/mod.ts";

export abstract class MovieDomainEvent implements DomainEvent {
    protected static readonly FQDN_PREFIX = 'howestprime.ticketing.movies';

    abstract get FQDN(): EventFQDN;
    abstract get occurredOn(): Date;
}

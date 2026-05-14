import {EventFQDN} from "@/Domain/Shared/DomainEvents/EventFQDN.ts";
import {OrderDomainEvent} from "./OrderDomainEvent.ts";

export class TicketReleased extends OrderDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.ticketreleased`,
    );

    private readonly _orderId: string;
    private readonly _customer: {
        salutation: string;
        firstname: string;
        lastname: string;
        email: string;
    } | null;

    private readonly _tickets: {
        ticketId: string;
        movieId: string;
        room: string;
        seatNumber: number;
        visitorType: string;
        price: number;
        showtime: Date;
    }[];



    private readonly _occurredOn: Date;

    private constructor(
        orderId: string,
        customer: {
            salutation: string;
            firstname: string;
            lastname: string;
            email: string;
        } | null,
        tickets: {
            ticketId: string;
            movieId: string;
            room: string;
            seatNumber: number;
            visitorType: string;
            price: number;
            showtime: Date;
        }[]
    ) {
        super();
        this._orderId = orderId;
        this._customer = customer;
        this._tickets = tickets;
        this._occurredOn = new Date();
    }
    static create(
        orderId: string,
        customer: {
            salutation: string;
            firstname: string;
            lastname: string;
            email: string;
        } | null,
        tickets: {
            ticketId: string;
            movieId: string;
            room: string;
            seatNumber: number;
            visitorType: string;
            price: number;
            showtime: Date;
        }[]
    ): TicketReleased {
        return new TicketReleased(
            orderId,
            customer,
            tickets
        );
    }
    get orderId(): string {
        return this._orderId;
    }
    get customer(): { salutation: string; firstname: string; lastname: string; email: string; } | null {
        return this._customer;
    }

    get tickets(): { ticketId: string; movieId: string; room: string; seatNumber: number; visitorType: string; price: number; showtime: Date; }[] {
        return this._tickets;
    }

    get occurredOn(): Date {
        return this._occurredOn;
    }
    override get FQDN(): EventFQDN {
        return TicketReleased.FQDN;
    }

}
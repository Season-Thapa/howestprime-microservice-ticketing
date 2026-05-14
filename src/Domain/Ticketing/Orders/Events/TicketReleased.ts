import {EventFQDN} from "@/Domain/Shared/DomainEvents/EventFQDN.ts";
import {OrderDomainEvent} from "./OrderDomainEvent.ts";

export class TicketReleased extends OrderDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${OrderDomainEvent.FQDN_PREFIX}.ticketreleased`,
    );
    /*
    OrderId: Id of the order.
Customer:

    Salutation: Salutation of the customer.
    Firstname: First name of the customer.
    Lastname: Last name of the customer.
    Email: Email address of the customer. The customer object can be null when no customer information is attached.

Tickets: List of released tickets.

    TicketId: Id of the ticket.
    MovieId: Id of the movie.
    Room: Room of the screening.
    SeatNumber: Reserved seat number.
    VisitorType: standard or discounted.
    Price: Price of the ticket.
    Showtime: Date and time of the screening
     */
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
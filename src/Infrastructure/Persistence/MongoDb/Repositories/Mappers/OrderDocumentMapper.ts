import type { Document } from "@mongodb";

import { Order, OrderId, Customer, OrderStatus, Ticket, BookingId } from "@/Domain/Ticketing/Orders/mod.ts";
import {boolean, number, string} from "npm:zod@3.25.76/v3/types.d.ts";
import { Money } from '@/Domain/Shared/ValueObjects/Money.ts';

interface CustomerDocumentShape {
    id: string;
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface TicketDocumentShape {
    id: string;
    movieInfo: {
        id: string;
        title: string;
        duration: number;
        genres: string[];
        posterUrl: string;
        ageRating: string;
        price: number;
    };
    room: string;
    seatNumber: number;
    visitorType: string;
    price: number;
    showtime: string;
}
interface OrderDocumentShape{
    _id?: string;
    id?: string;
    bookingId: string;
    customer: CustomerDocumentShape | null;
    tickets: TicketDocumentShape[],
    price: number,
    status: string;
    agreeToTerms: boolean;
}
export class OrderDocumentMapper implements Document<Order> {
    toDocument(aggregate: Order): Document {
        return {
            _id: aggregate.id.value,
            bookingId: aggregate.bookingId.value,
            customer: aggregate.customer ? {
                id: aggregate.customer.id.value,
                salutation: aggregate.customer.salutation,
                firstName: aggregate.customer.firstName.value,
                lastName: aggregate.customer.lastName.value,
                email: aggregate.customer.email.value
            } : null,
            tickets: aggregate.tickets.map(ticket => ({
                id: ticket.id.value,
                movieInfo: {
                    id: ticket.movieInfo.id.value,
                    title: ticket.movieInfo.title.value,
                    duration: ticket.movieInfo.duration.duration,
                    genres: ticket.movieInfo.genres.map(g => g.value),
                    posterUrl: ticket.movieInfo.posterUrl.value,
                    ageRating: ticket.movieInfo.ageRating.value,
                    price: ticket.movieInfo.price.amount
                },
                room: ticket.room,
                seatNumber: ticket.seat.seatNumber,
                visitorType: ticket.seat.visitorType,
                price: ticket.price.amount,
                showtime: ticket.showtime.toISOString()
            })),
            price: aggregate.price.amount,
            status: aggregate.status.value,
            agreeToTerms: aggregate.agreeToTerms
        };
    }

    reconstitute(document: Document): Order {
        const snapshot = document as unknown as OrderDocumentShape;
        const order = Object.create(Order.prototype) as {
            _id: OrderId;
            bookingId: BookingId;
            customer: Customer | null;
            tickets: Ticket[];
            price: Money;
            status: OrderStatus;
            agreeToTerms: boolean;
        }
        order._id = OrderId.create(snapshot._id || snapshot.id);
        order.bookingId = BookingId.create(snapshot.bookingId);
        order.price = Money.create(snapshot.price);
        order.status = OrderStatus.create(snapshot.status);
        order.agreeToTerms = snapshot.agreeToTerms;
        order._domainEvents = [];
        // 2. Map customer
        if (snapshot.customer) {
            // Note: Since Customer is an Entity, its .create() might generate a new ID,
            // so we reconstitute it using the Object.create trick as well to preserve the old ID!
            const cust = Object.create(Customer.prototype) as any;
            cust._id = CustomerId.create(snapshot.customer.id);
            cust._salutation = snapshot.customer.salutation;
            cust._firstName = CustomerFirstName.create(snapshot.customer.firstName);
            cust._lastName = CustomerLastName.create(snapshot.customer.lastName);
            cust._email = Email.create(snapshot.customer.email);

            order._customer = cust;
        } else {
            order._customer = null;
        }

        // 3. Map tickets
        order._tickets = snapshot.tickets.map(t => {
            const ticket = Object.create(Ticket.prototype) as any;
            ticket._id = TicketId.create(t.id);
            ticket._room = t.room;
            ticket._seat = Seat.create(t.seatNumber, t.visitorType as VisitorType);
            ticket._price = Money.create(t.price);
            ticket._showtime = new Date(t.showtime);

            // Rebuild movieInfo (Assuming MovieInfo has a `create` taking these args)
            // You may need to adapt imports for MovieId, MovieTitle etc if required by MovieInfo.create
            ticket._movieInfo = Object.create(MovieInfo.prototype); // Keep it clean
            // Manually reassign MovieInfo internals exactly like we do above depending on your MovieInfo constructor

            return ticket;
        });
        return order as unknown as Order;
    }
}


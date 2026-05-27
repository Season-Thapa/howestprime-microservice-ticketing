import type { Document } from '@mongodb';
import { type DocumentMapper } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

import { Money } from '@/Domain/Shared/mod.ts';
import { Email } from '@/Domain/Shared/mod.ts';

import {
    BookingId,
    MovieInfo,
    Order,
    OrderId,
    OrderStatus,
    OrderStatusState,
} from '@/Domain/Ticketing/Orders/mod.ts';
import {
    Customer,
    CustomerId,
    CustomerSalutation,
} from '@/Domain/Ticketing/Orders/Entities/Customer.ts';
import { Ticket, TicketId } from '@/Domain/Ticketing/Orders/Entities/Ticket.ts';
import { CustomerFirstName } from '@/Domain/Ticketing/Orders/ValueObjects/CustomerFirstName.ts';
import { CustomerLastName } from '@/Domain/Ticketing/Orders/ValueObjects/CustomerLastName.ts';
import { Seat, VisitorType } from '@/Domain/Ticketing/Orders/ValueObjects/Seat.ts';
import { AgeRating, Genre, MovieDuration, MovieTitle, PosterUrl } from '@/Domain/Shared/mod.ts';
import { MovieId } from '@/Domain/Ticketing/Movies/mod.ts';

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
        externalId: string;
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

interface OrderDocumentShape {
    _id?: string;
    id?: string;
    bookingId: string;
    customer: CustomerDocumentShape | null;
    tickets: TicketDocumentShape[];
    price: number;
    status: string;
    agreeToTerms: boolean;
}

export class OrderDocumentMapper implements DocumentMapper<Order> {
    toDocument(aggregate: Order): Document {
        return {
            _id: aggregate.id.value,
            bookingId: aggregate.bookingId.value,
            customer: aggregate.customer
                ? {
                    id: aggregate.customer.id.value,
                    salutation: aggregate.customer.salutation,
                    firstName: aggregate.customer.firstName.value,
                    lastName: aggregate.customer.lastName.value,
                    email: aggregate.customer.email.value,
                }
                : null,
            tickets: aggregate.tickets.map((ticket) => ({
                id: ticket.id.value,
                movieInfo: {
                    id: ticket.movieInfo.id.value,
                    externalId: ticket.movieInfo.externalId,
                    title: ticket.movieInfo.title.value,
                    duration: ticket.movieInfo.duration.duration,
                    genres: ticket.movieInfo.genres.map((genre) => genre.value),
                    posterUrl: ticket.movieInfo.posterUrl.value,
                    ageRating: ticket.movieInfo.ageRating.value,
                    price: ticket.movieInfo.price.amount,
                },
                room: ticket.room,
                seatNumber: ticket.seat.seatNumber,
                visitorType: ticket.seat.visitorType,
                price: ticket.price.amount,
                showtime: ticket.showtime.toISOString(),
            })),
            price: aggregate.price.amount,
            status: aggregate.status.value,
            agreeToTerms: aggregate.agreeToTerms,
        };
    }

    reconstitute(document: Document): Order {
        const snapshot = document as unknown as OrderDocumentShape;
        const order = Object.create(Order.prototype) as {
            _id: OrderId;
            _bookingId: BookingId;
            _customer: Customer | null;
            _tickets: Ticket[];
            _price: Money;
            _status: OrderStatus;
            _agreeToTerms: boolean;
            _domainEvents: unknown[];
        };

        order._id = OrderId.create((snapshot._id ?? snapshot.id) as string);
        order._bookingId = BookingId.create(snapshot.bookingId);
        order._price = Money.create(snapshot.price ?? 0);
        order._status = OrderStatus.create(snapshot.status as OrderStatusState);
        order._agreeToTerms = snapshot.agreeToTerms;
        order._domainEvents = [];

        if (snapshot.customer) {
            const customer = Object.create(Customer.prototype) as {
                _id: CustomerId;
                _salutation: CustomerSalutation;
                _firstName: CustomerFirstName;
                _lastName: CustomerLastName;
                _email: ReturnType<typeof Customer.create>['email'];
            };

            customer._id = CustomerId.create(snapshot.customer.id);
            customer._salutation = snapshot.customer.salutation as CustomerSalutation;
            customer._firstName = CustomerFirstName.create(snapshot.customer.firstName);
            customer._lastName = CustomerLastName.create(snapshot.customer.lastName);
            customer._email = Email.create(snapshot.customer.email);

            order._customer = customer as unknown as Customer;
        } else {
            order._customer = null;
        }

        order._tickets = snapshot.tickets.map((ticketSnapshot) => {
            const movieInfo = MovieInfo.create(
                MovieId.create(ticketSnapshot.movieInfo.id),
                ticketSnapshot.movieInfo.externalId,
                MovieTitle.create(ticketSnapshot.movieInfo.title),
                MovieDuration.create(ticketSnapshot.movieInfo.duration),
                ticketSnapshot.movieInfo.genres.map((genre) => Genre.create(genre)),
                PosterUrl.create(ticketSnapshot.movieInfo.posterUrl),
                AgeRating.create(ticketSnapshot.movieInfo.ageRating),
                Money.create(ticketSnapshot.movieInfo.price),
            );

            const ticket = Object.create(Ticket.prototype) as {
                _id: TicketId;
                _movieInfo: MovieInfo;
                _seat: Seat;
                _room: string;
                _price: Money;
                _showtime: Date;
            };

            ticket._id = TicketId.create(ticketSnapshot.id);
            ticket._movieInfo = movieInfo;
            ticket._seat = Seat.create(
                ticketSnapshot.seatNumber,
                ticketSnapshot.visitorType as VisitorType,
            );
            ticket._room = ticketSnapshot.room;
            ticket._price = Money.create(ticketSnapshot.price);
            ticket._showtime = new Date(ticketSnapshot.showtime);

            return ticket as unknown as Ticket;
        });

        return order as unknown as Order;
    }
}

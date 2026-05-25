import { Optional } from '@domaincrafters/std';
import { type Collection, type Document, type Filter } from '@mongodb';

import type {
    CustomerData,
    FindOrderByBookingIdQueryPort,
    OrderData,
    TicketData,
} from '@/Application/Ports/Queries/mod.ts';
import { MongoDbClient } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MongoDbGetOrderByBookingIdQuery implements FindOrderByBookingIdQueryPort {
    private readonly _collection: Collection<Document>;
    constructor(mongoDbClient: MongoDbClient) {
        this._collection = mongoDbClient.collection<Document>('orders');
    }
    async getOrderByBookingId(bookingId: string): Promise<Optional<OrderData>> {
        const filter: Filter<Document> = {
            bookingId: bookingId,
        } as unknown as Filter<Document>;
        const document = await this._collection.findOne(filter);

        if (!document) {
            return Optional.empty<OrderData>();
        }

        const tickets: TicketData[] = (document.tickets || []).map((ticket: Document) => ({
            id: ticket.id,
            seatNumber: ticket.seatNumber,
            price: ticket.price,
            movieId: ticket.movieId,
            room: ticket.room,
            showtime: new Date(ticket.showtime),
            visitorType: ticket.visitorType,
        }));

        const customer: CustomerData | null = document.customer
            ? {
                salutation: document.customer.salutation,
                firstName: document.customer.firstName,
                lastName: document.customer.lastName,
                email: document.customer.email,
            }
            : null;

        const orderData: OrderData = {
            id: document._id.toString(),
            bookingId: document.bookingId,
            status: document.status,
            price: document.price,
            agreeToTerms: document.agreeToTerms,
            customer,
            tickets,
        };
        return Optional.of<OrderData>(orderData);
    }
}

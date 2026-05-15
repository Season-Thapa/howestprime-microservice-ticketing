import { Optional } from '@domaincrafters/std';
import { type Collection, type Document, type Filter } from '@mongodb';

import type {
    OrderData,
    FindOrderByBookingIdQueryPort,
    CustomerData,
    TicketData
} from "@/Application/Ports/Queries/mod.ts";
import { MongoDbClient } from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';

export class MongoDbGetOrderByBookingIdQuery implements FindOrderByBookingIdQueryPort {
    private readonly _collection: Collection<Document>;
    constructor(mongoDbClient: MongoDbClient) {
        this._collection = mongoDbClient.collection<Document>('orders');
    }
    async getOrderByBookingId(bookingId: string): Promise<Optional<OrderData>> {
        const filter: Filter<Document> = {
            bookingId : bookingId
        } as unknown as Filter<Document>;
        const document = await this._collection.findOne(filter);

        if (!document) {
            return Optional.empty<OrderData>();
        }
       const doc = document.value;
        const tickets: TicketData[] = (doc.tickets || []).map((ticket: Document) => ({
            id: ticket.id,
            seatNumber: ticket.seatNumber,
            price: ticket.price,
            movieId: ticket.movieId,
            room: ticket.room,
            showtime: ticket.showgtime

        }));
        const customer: CustomerData = (doc.customers || null).map((customer: CustomerData) => ({
            salutation: customer.salutation,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
        }));
        const orderData: OrderData = {
            orderId: doc._id.toString(),
            bookingId: doc.bookingId,
            status: doc.status,
            price: doc.price,
            agreeToTerms: doc.agreeToTerms,
            customer,
            tickets

        }
        return Optional.of<OrderData>(orderData);

    }
}

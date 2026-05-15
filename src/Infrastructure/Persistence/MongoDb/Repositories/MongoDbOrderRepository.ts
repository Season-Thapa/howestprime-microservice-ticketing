import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import { BookingId, Order, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';
import type { OrderRepository } from '@/Domain/Ticketing/Orders/mod.ts';
import { OrderDocumentMapper } from './Mappers/OrderDocumentMapper.ts';
import { Optional } from '@domaincrafters/std';
import type { Document, Filter } from '@mongodb';
export class MongoDbOrderRepository extends MongoDbRepository<Order, OrderId>
    implements OrderRepository {
    static override readonly collectionName: string = 'orders';

    constructor(
        mongoDbClient: MongoDbClient,
        mapper: OrderDocumentMapper,
    ) {
        super(mongoDbClient, mapper, MongoDbOrderRepository.collectionName);
    }
    async findById(id: OrderId): Promise<Optional<Order>> {
        const filter = {
            _id: id.toString(),
        } as unknown as Filter<Document>;
        const document = await this._dbClient.findDocument(
            filter,
            MongoDbOrderRepository.collectionName,
        );
        if (!document.isPresent) {
            return Optional.empty<Order>();
        }

        return document.map((doc) => this['_documentMapper'].reconstitute(doc));
    }
    async byBookingId(bookingId: BookingId): Promise<Optional<Order>> {
        const filter = {
            bookingId: bookingId,
        } as unknown as Filter<Document>;
        const document = await this._dbClient.findDocument(
            filter,
            MongoDbOrderRepository.collectionName,
        );
        if (!document.isPresent) {
            return Optional.empty<Order>();
        }

        return document.map((doc) => this['_documentMapper'].reconstitute(doc));
    }
    override get entityName(): string {
        return Order.name;
    }
}

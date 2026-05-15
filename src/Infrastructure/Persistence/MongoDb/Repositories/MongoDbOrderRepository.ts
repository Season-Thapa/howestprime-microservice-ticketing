import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import  { Order, OrderId } from '@/Domain/Ticketing/Orders/mod.ts';
import type {  OrderRepository} from '@/Domain/Ticketing/Orders/mod.ts';
import { OrderDocumentMapper} from "./Mappers/OrderDocumentMapper.ts";
export class MongoDbOrderRepository extends MongoDbRepository<Order, OrderId> implements OrderRepository {
    static override readonly collectionName: string = 'orders';

    constructor(
        mongoDbClient: MongoDbClient,
        mapper: OrderDocumentMapper
    ) {
        super(mongoDbClient, mapper, MongoDbOrderRepository.collectionName);
    }
    override get entityName(): string{
        return Order.name;
    }
}
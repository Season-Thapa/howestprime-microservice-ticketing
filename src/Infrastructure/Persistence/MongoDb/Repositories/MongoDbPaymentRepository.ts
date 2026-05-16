import type { PaymentRepository} from "@/Domain/Ticketing/Payments/mod.ts";
import { Payment, PaymentId} from "@/Domain/Ticketing/Payments/mod.ts";
import {
    MongoDbClient,
    MongoDbRepository,
} from '@/Infrastructure/Persistence/MongoDb/Shared/mod.ts';
import {PaymentDocumentMapper} from "./Mappers/PaymentDocumentMapper.ts";
import {OrderId} from "@/Domain/Ticketing/Orders/mod.ts";
import type { Document, Filter } from '@mongodb';
import { Optional } from '@domaincrafters/std';


export class MongoDbPaymentRepository extends MongoDbRepository<Payment, PaymentId> implements PaymentRepository {
     static override readonly collectionName: string = 'payments';

    constructor(
        client: MongoDbClient,
        documentMapper: PaymentDocumentMapper,
    ) {
        super(
            client,
            documentMapper,
            MongoDbPaymentRepository.collectionName,
        );
    }
    async byOrderId(orderId: OrderId): Promise<Optional<Payment>> {
        const filter = {
            orderId: orderId.toString(),
        } as unknown as Filter<Document>;
        const document = await this._dbClient.findDocument(
            filter,
            MongoDbPaymentRepository.collectionName,
        );
        if (!document.isPresent) {
            return Optional.empty<Payment>();
        }

        return document.map((doc) => this['_documentMapper'].reconstitute(doc));
    }
    override get entityName(): string {
        return Payment.name;
    }

}
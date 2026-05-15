import { Repository } from '@/Domain/Shared/mod.ts';
import { Order, OrderId } from './Order.ts';
import { Optional } from '@domaincrafters/std';


export interface OrderRepository extends Repository<Order, OrderId> {
    findById(id: OrderId): Promise<Optional<Order>>;
}

import { Repository } from '@/Domain/Shared/mod.ts';
import { Order, OrderId } from './Order.ts';

export interface OrderRepository extends Repository<Order, OrderId> {
}

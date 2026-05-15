import { Repository } from '@/Domain/Shared/mod.ts';
import { Order, OrderId } from './Order.ts';
import { Optional } from '@domaincrafters/std';
import { BookingId } from './ValueObjects/BookingId.ts';

export interface OrderRepository extends Repository<Order, OrderId> {
    findById(id: OrderId): Promise<Optional<Order>>;
    byBookingId(id: BookingId): Promise<Optional<Order>>;
}

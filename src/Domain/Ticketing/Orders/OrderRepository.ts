import { Repository } from "@/Domain/Shared/mod.ts";
import { OrderId, Order } from './Order.ts';
import { BookingId } from './ValueObjects/BookingId.ts';

export interface OrderRepository extends Repository<Order, OrderId> {
    findById(id: OrderId): Promise<Optional<Order>>;
    findByBookingId(bookingId: BookingId): Promise<Optional<Order>>;
}
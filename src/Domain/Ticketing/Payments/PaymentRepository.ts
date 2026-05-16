import { Repository } from '@/Domain/Shared/mod.ts';
import { OrderId } from '../Orders/Order.ts';
import { Payment, PaymentId } from './Payment.ts';
import { Optional } from '@domaincrafters/std';

export interface PaymentRepository extends Repository<Payment, PaymentId> {
    byOrderId(orderId: OrderId): Promise<Optional<Payment>>;
}

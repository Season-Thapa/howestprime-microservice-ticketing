import { Repository } from "@/Domain/Shared/mod.ts";
import { OrderId, Order } from './Order.ts';

export interface OrderRepository extends Repository<Order, OrderId> {

}
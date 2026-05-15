import type { Optional } from '@domaincrafters/std';
import { CustomerData } from './CustomerData.ts';
import { TicketData } from '@/Application/Ports/Queries/TicketData.ts';
export interface OrderData {
    orderId: string;
    bookingId: string;
    status: string;
    price: number;
    agreeToTerms: boolean;
    customer: CustomerData | null;
    tickets: TicketData[];
}
export interface FindOrderByBookingIdQueryPort {
    getOrderByBookingId(bookingId: string): Promise<Optional<OrderData>>;
}

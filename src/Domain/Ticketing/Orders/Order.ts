import { AggregateRoot, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { OrderStatus, OrderStatusState } from './ValueObjects/OrderStatus.ts';
import { Money } from '../../Shared/ValueObjects/Money.ts';
import { Customer } from './Entities/Customer.ts';
import { Ticket } from './Entities/Ticket.ts';
import { BookingId } from './ValueObjects/BookingId.ts';
import { OrderPaid } from './Events/OrderPaid.ts';

export class OrderId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(value?: string): OrderId {
        return new OrderId(value);
    }
}

export class Order extends AggregateRoot<OrderId> {
    private readonly _bookingId: BookingId;
    private _customer: Customer | null;
    private readonly _tickets: Ticket[];
    private readonly _price: Money;
    private _status: OrderStatus;
    private _agreeToTerms: boolean;

    private constructor(
        id: OrderId,
        bookingId: BookingId,
        tickets: Ticket[],
        price: Money,
        status: OrderStatus,
        agreeToTerms: boolean,
        customer: Customer | null = null,
    ) {
        super(id);
        this._bookingId = bookingId;
        this._tickets = tickets;
        this._price = price;
        this._status = status;
        this._agreeToTerms = agreeToTerms;
        this._customer = customer;
    }

    static create(
        bookingId: BookingId,
        tickets: Ticket[],
    ): Order {
        const totalPriceAmount = tickets.reduce((sum, ticket) => sum + ticket.price.amount, 0);
        const totalPrice = Money.create(totalPriceAmount);
        const order = new Order(
            OrderId.create(),
            bookingId,
            tickets,
            totalPrice,
            OrderStatus.create(OrderStatusState.Open),
            false,
            null,
        );
        order.validate();
        return order;
    }

    get bookingId(): BookingId {
        return this._bookingId;
    }

    get customer(): Customer | null {
        return this._customer;
    }

    get tickets(): Ticket[] {
        return this._tickets;
    }

    get price(): Money {
        return this._price;
    }

    get status(): OrderStatus {
        return this._status;
    }

    get agreeToTerms(): boolean {
        return this._agreeToTerms;
    }

    public acceptTerms(): void {
        if (this._status.value !== OrderStatusState.Open) {
            throw new Error('Terms can only be accepted when the order is open.');
        }
        this._agreeToTerms = true;
    }

    public setCustomer(customer: Customer): void {
        if (this._status.value !== OrderStatusState.Open) {
            throw new Error('Customer can only be set when the order is open.');
        }
        if (!this._agreeToTerms) {
            throw new Error('Customer can only be added after terms are accepted.');
        }
        this._customer = customer;
    }
    public markAsPaid(): void {
        if (this._status.value !== OrderStatusState.Open) {
            throw new Error('Order can only be marked as paid when it is open.');
        }
        if (!this._agreeToTerms) {
            throw new Error('Order can only be paid after terms are accepted.');
        }
        this._status = OrderStatus.create(OrderStatusState.Paid);
        this.raise(OrderPaid.create(
            this.id.value,
            this.bookingId.value
            ));
    }
    public releaseTickets(): void {
        if (this._status.value !== OrderStatusState.Paid) {
            throw new Error('Tickets can only be released when the order is paid.');
        }
        this._status = OrderStatus.create(OrderStatusState.TicketReleased);
    }
    public cancel(): void {
        if (this._status.value !== OrderStatusState.Open) {
            throw new Error('Order can only be cancelled when it is open.');
        }
        this._status = OrderStatus.create(OrderStatusState.Canceled);
    }

    protected validate(): void {
        if (!this._tickets || this._tickets.length === 0) {
            throw new Error('An order must contain at least one ticket.');
        }
    }
}

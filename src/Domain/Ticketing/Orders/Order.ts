import { AggregateRoot, UUIDEntityId } from "@/Domain/Shared/mod.ts";
import { OrderStatus } from "./ValueObjects/OrderStatus.ts";
import { Money } from "../../Shared/ValueObjects/Money.ts";
import {Customer} from "./Entities/Customer.ts";
import { Ticket } from "./Entities/Ticket.ts";
import {BookingId} from "./ValueObjects/BookingId.ts";

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
        customer: Customer | null = null
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
        price: Money,
        status: OrderStatus,
        agreeToTerms: boolean,
        customer?: Customer
    ): Order {
        return new Order(
            OrderId.create(),
            bookingId,
            tickets,
            price,
            status,
            agreeToTerms,
            customer || null
        );
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

    public setCustomer(customer: Customer): void {
        this._customer = customer;
    }

    public updateStatus(newStatus: OrderStatus): void {
        this._status = newStatus;
    }


}
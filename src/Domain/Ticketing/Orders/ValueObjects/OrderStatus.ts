import { DomainException,ValueObject} from '@/Domain/Shared/mod.ts';
export class InvalidStatusTransitionException extends DomainException {
    constructor(from: OrderStatus, to: OrderStatus, reason?: string) {
        const baseMessage = `Invalid order status transition from "${from}" to "${to}".`;
        const fullMessage = reason
            ? `${baseMessage} ${reason}`
            : `${baseMessage} This transition is not allowed by order business rules.`;
        super(fullMessage);
    }
}
export enum OrderStatusState {
    Open = "Open",
    Paid = "Paid",
    TicketReleased = "TicketReleased",
    Canceled = "Canceled"
}
export class OrderStatus extends ValueObject {

    private readonly _value: OrderStatusState;

    private constructor(value: OrderStatusState) {
        super();
        this._value = value;
    }

    public static create(value: OrderStatusState): OrderStatus {

        const status =new OrderStatus(value);
        return status;
    }
    static readonly Open =  OrderStatus.create(OrderStatusState.Open);
    static readonly Paid =  OrderStatus.create(OrderStatusState.Paid);
    static readonly TicketReleased =  OrderStatus.create(OrderStatusState.TicketReleased);
    static readonly Canceled =  OrderStatus.create(OrderStatusState.Canceled);
    transitionTo(targetStatus: OrderStatus) : OrderStatus {
        if(!this.canTransitionTO(targetStatus)){
            let reason: string = '';

            if (this.equals(targetStatus)) {
                reason = 'The order is already in this status.';
            } else {
                reason = 'This transition violates order  rules.';
            }
            throw new InvalidStatusTransitionException(this, targetStatus, reason);
        }
        return targetStatus;
    }

    private canTransitionTO(newStatus: OrderStatus): boolean {
        const validTransition : Record<OrderStatusState, OrderStatusState[]> = {

            [OrderStatusState.Open]: [
                OrderStatusState.Paid,
                OrderStatusState.Canceled
            ],
            [OrderStatusState.Paid]: [
                OrderStatusState.TicketReleased
        ],
            [OrderStatusState.TicketReleased]: [],
            [OrderStatusState.Canceled]: []

        };
        return validTransition[this._value]?.includes(newStatus._value);
    }
    acceptTerms(): boolean {
        if(this._value === OrderStatusState.Open) {
            return true;
        }
        return false;
    }
    get value(): OrderStatusState {
        return this._value;
    }
    override equals(other: OrderStatus): boolean {
        if (!other) {
            return false;
        }
        return this._value === other._value;
    }

}
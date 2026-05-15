import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';
export class InvalidPaymentStatusTransitionException extends DomainException {
    constructor(from: PaymentStatus, to: PaymentStatus, reason?: string) {
        const baseMessage = `Invalid payment status transition from "${from}" to "${to}".`;
        const fullMessage = reason
            ? `${baseMessage} ${reason}`
            : `${baseMessage} This transition is not allowed by payment business rules.`;
        super(fullMessage);
    }
}
export enum PaymentStatusState {
    Pending = 'Pending',
    Success = 'Success',
    Failed = 'Failed',
}
export class PaymentStatus extends ValueObject {
    private readonly _value: PaymentStatusState;

    private constructor(value: PaymentStatusState) {
        super();
        this._value = value;
    }

    static create(value: PaymentStatusState): PaymentStatus {
        const status = new PaymentStatus(value);
        return status;
    }
    static readonly Pending = PaymentStatus.create(PaymentStatusState.Pending);
    static readonly Success = PaymentStatus.create(PaymentStatusState.Success);
    static readonly Failed = PaymentStatus.create(PaymentStatusState.Failed);
    transitionTo(targetStatus: PaymentStatus): PaymentStatus {
        if (!this.canTransitionTo(targetStatus)) {
            let reason: string = '';

            if (this.equals(targetStatus)) {
                reason = 'The payment is already in this status.';
            } else {
                reason = 'This transition violates payment  rules.';
            }

            throw new InvalidPaymentStatusTransitionException(this, targetStatus, reason);
        }

        return targetStatus;
    }
    private canTransitionTo(newStatus: PaymentStatus): boolean {
        const validTransitions: Record<PaymentStatusState, PaymentStatusState[]> = {
            [PaymentStatusState.Pending]: [
                PaymentStatusState.Success,
                PaymentStatusState.Failed,
            ],
            [PaymentStatusState.Failed]: [],
            [PaymentStatusState.Success]: [],
        };
        return validTransitions[this._value].includes(newStatus._value);
    }
    get value(): string {
        return this._value;
    }
    override equals(other: PaymentStatus): boolean {
        if (!other) {
            return false;
        }
        return this._value === other._value;
    }
}

import {DomainException, ValueObject} from "@/Domain/Shared/mod.ts";
export class InvalidPaymentAmountException extends DomainException {
    constructor(value: number) {
        super(`Payment amount must be finite and greater than 0. invalid value: '${value}'`);
    }
}
export class PaymentAmount extends ValueObject {
    private readonly _value: number;

    private constructor(value: number) {
        super();
        this._value = value;
    }

    public static create(value: number): PaymentAmount {
        const newPaymentAmount = new PaymentAmount(value);
        newPaymentAmount.validate();
        return newPaymentAmount;
    }

    get value(): number {
        return this._value;
    }

    protected validate(): void {
        if (!Number.isFinite(this._value) || this._value <= 0) {
            throw new InvalidPaymentAmountException(this._value);
        }
    }

    public equals(other: PaymentAmount): boolean {
        if (!other) return false;
        return this._value === other.value;
    }
}
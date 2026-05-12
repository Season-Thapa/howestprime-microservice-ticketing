import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';

export class InvalidPaymentMethodException extends DomainException {
    constructor(value: string) {
        super(`PaymentMethod has invalid value: '${String(value)}'`);
    }
}
export class PaymentMethod  extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): PaymentMethod {
        const paymentMethod = new PaymentMethod(value);
        paymentMethod.validate();
        return paymentMethod;
    }

    protected validate(): void {
        if (!this._value || this._value.trim().length === 0) {
            throw new InvalidPaymentMethodException(this._value);
        }

    }
    get value(): string {
        return this._value;
    }

    equals(other: PaymentMethod): boolean {
        return other?._value === this._value;
    }

    override toString(): string {
        return this._value;
    }
}

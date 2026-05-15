import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';

export class InvalidPaymentMethodException extends DomainException {
    constructor(value: string) {
        super(
            `PaymentMethod must be either credit card or bank transfer. invalid value: '${
                String(value)
            }'`,
        );
    }
}
export enum PaymentMethodType {
    CreditCard = 'Credit Card',
    BankTransfer = 'Bank Transfer',
}

export class PaymentMethod extends ValueObject {
    private readonly _value: PaymentMethodType;
    private constructor(value: PaymentMethodType) {
        super();
        this._value = value;
    }

    static create(value: PaymentMethodType): PaymentMethod {
        const paymentMethod = new PaymentMethod(value);
        paymentMethod.validate();
        return paymentMethod;
    }

    protected validate(): void {
        const validValues = Object.values(PaymentMethodType);
        if (!validValues.includes(this._value)) {
            throw new InvalidPaymentMethodException(String(this._value));
        }
    }
    get value(): string {
        return this._value;
    }

    equals(other: PaymentMethod): boolean {
        return other?._value === this._value;
    }

    override toString(): PaymentMethodType {
        return this._value;
    }
}

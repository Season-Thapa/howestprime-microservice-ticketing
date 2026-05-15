import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';
export class InvalidCardException extends DomainException {
    constructor(value: string) {
        super(
            `Invalid card number format. Must be between 12 and 19 digits. Invalid value: '${
                String(value)
            }'`,
        );
    }
}
export class CardNumber extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value.replace(/[\s-]/g, '');
    }

    public static create(value: string): CardNumber {
        const cardNumber = new CardNumber(value);
        cardNumber.validate();
        return cardNumber;
    }

    get value(): string {
        return this._value;
    }

    protected validate(): void {
        if (!/^\d{12,19}$/.test(this._value)) {
            throw new InvalidCardException(this._value);
        }
    }

    public equals(other: CardNumber): boolean {
        return this._value === other.value;
    }
}

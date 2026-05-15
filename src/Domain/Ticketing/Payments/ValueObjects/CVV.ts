import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';
export class InvalidCVVException extends DomainException {
    constructor(value: string) {
        super(`Invalid CVV format. Must be 3 or 4 digits. '${String(value)}'`);
    }
}
export class CVV extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
        this.validate();
    }

    public static create(value: string): CVV {
        const cVV = new CVV(value);
        cVV.validate();
        return cVV;
    }

    get value(): string {
        return this._value;
    }

    protected validate(): void {
        if (!/^\d{3,4}$/.test(this._value)) {
            throw new InvalidCVVException(this._value);
        }
    }

    public equals(other: CVV): boolean {
        if (!other) return false;
        return this._value === other.value;
    }
}

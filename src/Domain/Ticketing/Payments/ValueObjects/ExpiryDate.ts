import {DomainException, ValueObject} from "@/Domain/Shared/mod.ts";
export class InvalidExpiryDataException extends DomainException {
    constructor(value: string) {
        super(`Invalid expiry date format. Must be MM/YY. '${String(value)}'`);
    }
}
export class ExpiryDate extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
        this.validate();
    }

    public static create(value: string): ExpiryDate {
        const expiryDate = new ExpiryDate(value);
        expiryDate.validate();
        return expiryDate;
    }

    get value(): string {
        return this._value;
    }

    protected validate(): void {
        if (!/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(this._value)) {
            throw new InvalidExpiryDataException(this._value);
        }
    }

    public equals(other: ExpiryDate): boolean {
        if (!other) return false;
        return this._value === other.value;
    }
}
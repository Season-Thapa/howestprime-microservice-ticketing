import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';

export class InvalidCustomerLastNameException extends DomainException {
    constructor(value: string) {
        super(`CustomerLastName has invalid value: '${String(value)}'`);
    }
}
export class CustomerLastName extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CustomerLastName {
        const lastName = new CustomerLastName(value);
        lastName.validate();
        return lastName;
    }

    protected validate(): void {
        if (!this._value || this._value.trim().length === 0) {
            throw new InvalidCustomerLastNameException(this._value);
        }
    }
    get value(): string {
        return this._value;
    }

    equals(other: CustomerLastName): boolean {
        return other?._value === this._value;
    }

    override toString(): string {
        return this._value;
    }
}

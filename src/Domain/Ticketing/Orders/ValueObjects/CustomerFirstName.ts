import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';

export class InvalidCustomerFirstNameException extends DomainException {
    constructor(value: string) {
        super(`CustomerFirstName has invalid value: '${String(value)}'`);
    }
}
export class CustomerFirstName  extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): CustomerFirstName {
        const firstName = new CustomerFirstName(value);
        firstName.validate();
        return firstName;
    }

    protected validate(): void {
        if (!this._value || this._value.trim().length === 0) {
            throw new InvalidCustomerFirstNameException(this._value);
        }

    }
    get value(): string {
        return this._value;
    }

    equals(other: CustomerFirstName): boolean {
        return other?._value === this._value;
    }

    override toString(): string {
        return this._value;
    }
}

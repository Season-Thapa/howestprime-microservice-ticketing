import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';

export class InvalidMoneyException extends DomainException {
    constructor(value: number) {
        super(`Money has invalid value: '${value}'`);
    }
}
export class Money  extends ValueObject {
    private readonly _value: number;
    private constructor(value: number) {
        super();
        this._value = value;
    }

    static create(value: number): Money {
        const money = new Money(value);
        money.validate();
        return money;
    }

    protected validate(): void {
     

    }

    get money(): number {

        return this._value;
    }
    get totalMoney(): number {
        return this._value;
    }
    equals(other: Money): boolean {
        return other._value === this._value;
    }

    override toString(): string {
        return this._value.toString();
    }
}

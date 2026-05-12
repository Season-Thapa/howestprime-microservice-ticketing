import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';

export class InvalidMoneyException extends DomainException {
    constructor() {
        super(`Amount must be greater than or equal to 0`);
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
     if(this._value < 0){
        throw new InvalidMoneyException();
     }
    }

    get amount(): number {
        return this._value;
    }

    equals(other: Money): boolean {
        return other._value === this._value;
    }

    override toString(): string {
        return this._value.toString();
    }
}

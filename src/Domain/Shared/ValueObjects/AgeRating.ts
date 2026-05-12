import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';
export class InvalidAgeRatingException extends DomainException {
    constructor(value: number) {
        super(`AgeRating has invalid value: '${value}'`);
    }
}
export class AgeRating  extends ValueObject {
    private readonly _value: number;
    private constructor(value: number) {
        super();
        this._value = value;
    }

    static create(value: number): AgeRating {
        const ageRating = new AgeRating(value);
        ageRating.validate();
        return ageRating;
    }

    protected validate(): void {
        if (!this._value || this._value === 0) {
            throw new InvalidAgeRatingException(this._value);
        }

    }

    get value(): number {

        return this._value;
    }

    equals(other: AgeRating): boolean {
        return other._value === this._value;
    }

    override toString(): string {
        return this._value.toString();
    }
}

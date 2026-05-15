import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';
export class InvalidAgeRatingException extends DomainException {
    constructor(value: string) {
        super(`AgeRating has invalid value: '${String(value)}'`);
    }
}
export class AgeRating extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): AgeRating {
        const ageRating = new AgeRating(value);
        ageRating.validate();
        return ageRating;
    }

    protected validate(): void {
        const trimmedValue = this._value?.trim();
        if (!trimmedValue || trimmedValue === '') {
            throw new InvalidAgeRatingException(this._value);
        }
    }

    get value(): string {
        return this._value;
    }

    equals(other: AgeRating): boolean {
        return other._value === this._value;
    }

    override toString(): string {
        return this._value.toString();
    }
}

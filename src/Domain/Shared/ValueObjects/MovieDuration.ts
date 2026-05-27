import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';
const MIN_Duration_LENGTH = 1;

export class InvalidMovieDurationException extends DomainException {
    constructor(value: number) {
        super(`Duration has invalid value: '${value}'`);
    }
}
export class MovieDuration extends ValueObject {
    private readonly _value: number;
    private constructor(value: number) {
        super();
        this._value = value;
    }

    static create(value: number): MovieDuration {
        const title = new MovieDuration(value);
        title.validate();
        return title;
    }

    protected validate(): void {
        if (this._value < MIN_Duration_LENGTH) {
            throw new InvalidMovieDurationException(this._value);
        }
    }

    get duration(): number {
        if (this._value > 100) {
            return this._value + 10;
        }
        return this._value;
    }
    get totalDuration(): number {
        if (this._value > 100) {
            return this._value + 10;
        }
        return this._value;
    }
    equals(other: MovieDuration): boolean {
        return other._value === this._value;
    }

    override toString(): string {
        return this._value.toString();
    }
}

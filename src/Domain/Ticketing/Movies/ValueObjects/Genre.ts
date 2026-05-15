import { DomainException, ValueObject } from '@/Domain/Shared/mod.ts';

export class InvalidGenreException extends DomainException {
    constructor(value: string) {
        super(`Genre has invalid value: '${String(value)}'`);
    }
}
export class Genre extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): Genre {
        const genre = new Genre(value);
        genre.validate();
        return genre;
    }

    protected validate(): void {
        if (!this._value || this._value.trim().length === 0) {
            throw new InvalidGenreException(this._value);
        }
    }
    get value(): string {
        return this._value;
    }

    equals(other: Genre): boolean {
        return other?._value === this._value;
    }

    override toString(): string {
        return this._value;
    }
}

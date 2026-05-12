import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';

export class InvalidMovieTitleException extends DomainException {
    constructor(value: string) {
        super(`MovieTitle has invalid value: '${String(value)}'`);
    }
}
export class MovieTitle  extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): MovieTitle {
        const title = new MovieTitle(value);
        title.validate();
        return title;
    }

    protected validate(): void {
        if (!this._value || this._value.trim().length === 0) {
            throw new InvalidMovieTitleException(this._value);
        }

    }
    get value(): string {
        return this._value;
    }

    equals(other: MovieTitle): boolean {
        return other?._value === this._value;
    }

    override toString(): string {
        return this._value;
    }
}

import {DomainException, ValueObject} from '@/Domain/Shared/mod.ts';

export class InvalidPosterUrlException extends DomainException {
    constructor(value: string) {
        super(`PosterUrl has invalid value: '${String(value)}'`);
    }
}
export class PosterUrl  extends ValueObject {
    private readonly _value: string;
    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): PosterUrl {
        const posterUrl = new PosterUrl(value);
        posterUrl.validate();
        return posterUrl;
    }

    protected validate(): void {
        if (!this._value || this._value.trim().length === 0) {
            throw new Error("Poster URL must not be empty.");
        }

        try {
            new URL(this._value);
        } catch {
            throw new Error("Poster URL must be a valid URL.");
        }
    }
    get value(): string {
        return this._value;
    }

    equals(other: PosterUrl): boolean {
        return other?._value === this._value;
    }

    override toString(): string {
        return this._value;
    }
}

import { ValueObject } from '@/Domain/Shared/mod.ts';
import { IllegalArgumentException } from '@domaincrafters/std';

export class ExternalMovieId extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): ExternalMovieId {
        if (!value || value.trim().length === 0) {
            throw new IllegalArgumentException('ExternalMovieId cannot be empty');
        }

        return new ExternalMovieId(value);
    }

    override equals(other: ExternalMovieId): boolean {
        return other._value === this._value;
    }
    override toString(): string {
        return this._value;
    }
}

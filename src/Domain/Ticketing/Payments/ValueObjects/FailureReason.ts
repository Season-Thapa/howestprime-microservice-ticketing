import { ValueObject } from '@/Domain/Shared/mod.ts';

export class FailureReason extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value.trim();
    }

    public static create(value: string): FailureReason {
        const reason = new FailureReason(value);
        reason.validate();
        return reason;
    }

    get value(): string {
        return this._value;
    }

    protected validate(): void {
        if (!this._value || this._value === '') {
            throw new Error('Failure reason must not be empty.');
        }
    }

    public equals(other: FailureReason): boolean {
        if (!other) return false;
        return this._value === other.value;
    }
}

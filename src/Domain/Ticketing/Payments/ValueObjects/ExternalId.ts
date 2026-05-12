import { ValueObject } from "@/Domain/Shared/mod.ts";

export class ExternalId extends ValueObject {
    private readonly _value: string;

    private constructor(value: string) {
        super();
        this._value = value;
    }

    static create(value: string): ExternalId {
        const externalId = new ExternalId(value);
        externalId.validate();
        return externalId;
    }

    get value(): string {
        return this._value;
    }

    protected validate(): void {
        const trimmedValue = this._value?.trim();
        if (!trimmedValue || trimmedValue === "") {
            throw new Error("External Id must not be empty after trimming.");
        }
    }

    public equals(other: ExternalId): boolean {
        if (!other) return false;
        return this._value === other.value;
    }
}
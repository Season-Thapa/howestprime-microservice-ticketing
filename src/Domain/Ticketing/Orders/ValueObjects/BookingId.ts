import { UUIDEntityId } from "@/Domain/Shared/mod.ts";

export class BookingId extends UUIDEntityId {
    private constructor(id: string) {
        super(id);
    }

    static create(value: string): BookingId {
        return new BookingId(value);
    }
}
import type { CreateOrderFromBookingUseCaseInput } from '@/Application/Ticketing/Orders/CreateOrderFromBooking.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import type { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { IllegalArgumentException } from '@domaincrafters/std';
export interface CreateOrderFromBookingRequest {
    bookingId: unknown;
    movieId: unknown;
    room: unknown;
    showtime: unknown;
    standardVisitors: unknown;
    discountedVisitors: unknown;
    seatNumbers: unknown;
}
export class CreateOrderFromBookingController
    implements AmqpController<CreateOrderFromBookingRequest> {
    constructor(
        private readonly _createOrderFromBookingUseCase: UseCase<
            CreateOrderFromBookingUseCaseInput,
            string
        >,
    ) {
    }

    async handle(request: CreateOrderFromBookingRequest): Promise<void> {
        const input = this.extractInput(request as unknown);
        await this._createOrderFromBookingUseCase.execute(input);
    }
    private extractInput(request: unknown): CreateOrderFromBookingUseCaseInput {
        if (request === null || typeof request !== 'object') {
            throw new IllegalArgumentException('Suggestion create payload must be a JSON object.');
        }
        const payload = request as Record<string, unknown>;
        const body = Object.hasOwn(payload, 'payload')
            ? (payload.payload as Record<string, unknown>)
            : payload;

        return {
            bookingId: this.requireNonEmptyString(body.bookingId, 'bookingId'),
            movieId: this.requireNonEmptyString(body.movieId, 'movieId'),
            room: this.requireNonEmptyString(body.room, 'Room'),
            showtime: this.requireNonEmptyString(body.showtime, 'Showtime'),
            standardVisitors: this.requireNumber(body.standardVisitors, 'StandardVisitors'),
            discountedVisitors: this.requireNumber(body.discountedVisitors, 'DiscountedVisitors'),
            seatNumbers: this.requireNumberArray(body.seatNumbers, 'SeatNumbers'),
        };
    }
    private requireNonEmptyString(value: unknown, fieldName: string): string {
        if (typeof value !== 'string') {
            throw new IllegalArgumentException(`Field '${fieldName}' must be a string.`);
        }

        if (value.trim().length === 0) {
            throw new IllegalArgumentException(`Field '${fieldName}' must not be empty.`);
        }

        return value;
    }

    private requireNumber(value: unknown, fieldName: string): number {
        if (typeof value !== 'number') {
            throw new IllegalArgumentException(`Field '${fieldName}' must be a number.`);
        }

        return value;
    }

    private requireNumberArray(value: unknown, fieldName: string): number[] {
        if (!Array.isArray(value)) {
            throw new IllegalArgumentException(`Field '${fieldName}' must be an array.`);
        }

        const arr = value as unknown[];
        if (arr.length === 0) {
            throw new IllegalArgumentException(`Field '${fieldName}' must not be empty.`);
        }

        for (const v of arr) {
            if (typeof v !== 'number') {
                throw new IllegalArgumentException(
                    `All entries in '${fieldName}' must be non-empty number.`,
                );
            }
        }

        return arr as number[];
    }
}

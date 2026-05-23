import type { UseCase } from '@/Application/Ports/mod.ts';
import type { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import type { CreateOrderFromBookingUseCaseInput } from '@/Application/Ticketing/Orders/CreateOrderFromBooking.ts';
import { IllegalArgumentException } from '@domaincrafters/std';

export interface CreateOrderFromBookingRequest {
    bookingId: unknown;
    externalMovieId: unknown;
    movieId: unknown; // ✅ backward compatibility (IMPORTANT FIX)
    room: unknown;
    showtime: unknown;
    standardVisitors: unknown;
    discountVisitors: unknown;
    seatNumbers: unknown;
}

export class CreateOrderFromBookingController
    implements AmqpController<CreateOrderFromBookingRequest> {

    constructor(
        private readonly _useCase: UseCase<CreateOrderFromBookingUseCaseInput, string>,
    ) {}

    async handle(request: CreateOrderFromBookingRequest): Promise<void> {
        console.log('=== INCOMING AMQP MESSAGE START ===');
        console.log(JSON.stringify(request, null, 2));
        console.log('=== INCOMING AMQP MESSAGE END ===');
        try {
            const input = this.extractInput(request as unknown);

            console.log('📦 Parsed AMQP payload', input); // Fallback log;

            const result = await this._useCase.execute(input);
            console.log('✅ Order created from booking event', {
                orderId: result,
                bookingId: input.bookingId, });
        } catch (error) {
            // 🔥 IMPORTANT: log full failure context
            console.error('❌ Failed to process booking event', {
                error,
                raw: request,
            });

            throw error;
        }
    }

    private extractInput(request: unknown): CreateOrderFromBookingUseCaseInput {
        if (typeof request !== 'object' || request === null) {
            throw new IllegalArgumentException('Invalid AMQP payload');
        }


        const body = request as Record<string, unknown>;

        return {
            bookingId: this.requireString(body.bookingId, 'bookingId'),

            // ✅ FIX: accept both old and new contracts
            externalMovieId: this.requireString(
                body.externalMovieId ?? body.movieId,
                'externalMovieId',
            ),

            room: this.requireString(body.room, 'room'),
            showtime: this.requireString(body.showtime, 'showtime'),

            standardVisitors: this.requireNumber(body.standardVisitors, 'standardVisitors'),

            discountVisitors: this.requireNumber(
                body.discountVisitors ?? body.discountedVisitors ?? 0,
                'discountVisitors',
            ),

            seatNumbers: this.normalizeSeatNumbers(body.seatNumbers),
        };
    }

    private requireString(value: unknown, field: string): string {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw new IllegalArgumentException(`Field '${field}' must be a non-empty string.`);
        }
        return value;
    }

    private requireNumber(value: unknown, field: string): number {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new IllegalArgumentException(`Field '${field}' must be a number.`);
        }
        return value;
    }

    private normalizeSeatNumbers(value: unknown): number[] {
        if (!Array.isArray(value)) {
            return [];
        }

        return value.map((v) => {
            const n = typeof v === 'string' ? Number(v) : v;

            if (typeof n !== 'number' || !Number.isFinite(n)) {
                throw new IllegalArgumentException(
                    `Invalid seat number: ${v}`,
                );
            }

            return n;
        });
    }
}
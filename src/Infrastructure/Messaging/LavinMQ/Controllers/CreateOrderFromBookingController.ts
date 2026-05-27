import type { CreateOrderFromBookingUseCaseInput } from '@/Application/Ticketing/Orders/CreateOrderFromBooking.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import type { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { Guard } from '@domaincrafters/std';

export interface CreateOrderFromBookingRequest {
    bookingId: string;
    movieId: string;
    room: string;
    showtime: string;
    standardVisitors: number;
    discountVisitors: number;
    seatNumbers: string[];
}
export class CreateOrderFromBookingController
    implements AmqpController<CreateOrderFromBookingRequest> {
    private readonly _createOrderFromBookingUseCase: UseCase<
        CreateOrderFromBookingUseCaseInput,
        string
    >;
    constructor(
        createOrderFromBookingUseCase: UseCase<CreateOrderFromBookingUseCaseInput, string>,
    ) {
        this._createOrderFromBookingUseCase = createOrderFromBookingUseCase;
    }

    async handle(request: CreateOrderFromBookingRequest): Promise<void> {
        const input: CreateOrderFromBookingUseCaseInput = this.validateInput(request);
        await this._createOrderFromBookingUseCase.execute(input);
    }
    private validateInput(
        request: CreateOrderFromBookingRequest,
    ): CreateOrderFromBookingUseCaseInput {
        Guard.check(request.bookingId).againstWhitespace();
        Guard.check(request.movieId).againstWhitespace();
        Guard.check(request.room).againstWhitespace();
        Guard.check(request.seatNumbers).againstEmpty();

        return {
            bookingId: request.bookingId,
            externalId: request.movieId,
            room: request.room,
            showtime: request.showtime,
            standardVisitors: request.standardVisitors,
            discountedVisitors: request.discountVisitors,
            seatNumbers: request.seatNumbers.map(Number),
        };
    }
}

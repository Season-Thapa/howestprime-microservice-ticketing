import type { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import type { MovieRepository } from '@/Domain/Ticketing/Movies/mod.ts';

import { BookingId, MovieInfo, Order } from '@/Domain/Ticketing/Orders/mod.ts';
import { Seat, VisitorType } from '@/Domain/Ticketing/Orders/ValueObjects/Seat.ts';
import { Ticket } from '@/Domain/Ticketing/Orders/Entities/Ticket.ts';

export interface CreateOrderFromBookingUseCaseInput {
    bookingId: string;
    externalId: string;
    room: string;
    showtime: string;
    standardVisitors: number;
    discountVisitors: number;
    seatNumbers: number[];
}
export class CreateOrderFromBooking implements UseCase<CreateOrderFromBookingUseCaseInput, string> {
    private readonly _unitOfWork: UnitOfWork;
    private readonly _logger: Logger;

    constructor(unitOfWork: UnitOfWork, logger: Logger) {
        this._unitOfWork = unitOfWork;
        this._logger = logger;
    }
    async execute(input: CreateOrderFromBookingUseCaseInput): Promise<string> {
        this._logger.debug('Creating Order from booking', { input });
        const totalVisitors = input.standardVisitors + input.discountVisitors;
        if (input.seatNumbers.length !== totalVisitors) {
            throw new Error(
                `Mismatch: Provided ${input.seatNumbers.length} seats for ${totalVisitors} visitors.`,
            );
        }
        const result = await this._unitOfWork.do<string>(async () => {
            const movieRepository = this._unitOfWork.getRepository<MovieRepository>('Movie');
            const externalId =input.externalId;
            const movieOptional = await movieRepository.findByExternalMovieId(externalId);

            if (!movieOptional.isPresent) {
                throw new Error(
                    `Movie with ID ${input.externalId} not found. Ensure MovieRegistered event was processed.`,
                );
            }

            const movie = movieOptional.getOrThrow(
                `Movie with ID ${input.externalId} should be present.`,
            );

            const movieInfo = MovieInfo.create(
                movie.externalId,
                movie.title,
                movie.duration,
                movie.genres,
                movie.posterUrl,
                movie.ageRating,
                movie.price,
            );
            const tickets: Ticket[] = [];
            let remainingStandard = input.standardVisitors;
            const showtimeDate = new Date(input.showtime);
            for (const seatNumber of input.seatNumbers) {
                const visitorType = remainingStandard > 0
                    ? VisitorType.Standard
                    : VisitorType.Discounted;
                if (remainingStandard > 0) remainingStandard--;
                const seat = Seat.create(seatNumber, visitorType);
                const ticket = Ticket.create(movieInfo, seat, input.room, showtimeDate);
                tickets.push(ticket);
            }
            var bookingId: BookingId = BookingId.create(input.bookingId);

            const order = Order.create(bookingId, tickets);

            this._logger.info('Created Order from booking', { order });
            await this._unitOfWork.save(order);
            this._logger.info('Order value:', { orderId: order.id.value });
            this._logger.info('Order string', { orderId: order.id.toString() });

            return order.id.value;
        });
        return result;
    }
}

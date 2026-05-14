import type {
    Logger,
    UnitOfWork,
    UseCase
} from "@/Application/Ports/mod.ts";
import type { MovieRepository } from "@/Domain/Ticketing/Movies/mod.ts";
import {
    Order,
    BookingId,
    OrderStatusState,
    MovieInfo,

} from '../../../Domain/Ticketing/Orders/mod.ts';import { BookingOpened } from '@/Domain/Ticketing/Bookings/Events/BookingOpened.ts';
import { Seat } from '@/Domain/Ticketing/Orders/ValueObjects/Seat.ts';
import { Ticket } from '@/Domain/Ticketing/Orders/Entities/Ticket.ts';

export interface CreateOrderFromBookingInput {
    BookingId: string;
    MovieId: string;
    Room: string;
    Showtime: string;
    StandardVisitors: number;
    DiscountedVisitors: number;
    SeatNumbers: number[];
}
export class CreateOrderFromBooking implements UseCase<CreateOrderFromBookingInput, string> {
    private readonly _unitOfWork: UnitOfWork;
    private readonly _logger: Logger;

    constructor(
        unitOfWork: UnitOfWork,
        logger: Logger,
    ) {
        this._unitOfWork = unitOfWork;
        this._logger = logger;
    }
    async execute(input: CreateOrderFromBookingInput): Promise<string> {
        this._logger.debug('Creating Order from booking', { input });
        const totalVisitors = input.standardVisitors + input.discountedVisitors;
        if (input.seatNumbers.length !== totalVisitors) {
            throw new Error(`Mismatch: Provided ${input.seatNumbers.length} seats for ${totalVisitors} visitors.`);
        }
        const result = await this._unitOfWork.do<string>(async () => {
            const movieRepository = this._unitOfWork.getRepository<MovieRepository>('Movie');
            const movieId = MovieId.create(input.movieId);
            const movie = await movieRepository.findById(movieId);

            if (!movie) {
                throw new Error(`Movie with ID ${input.movieId} not found. Ensure MovieRegistered event was processed.`);
            }

            const movieInfo = MovieInfo.create(
                movie.id,
                movie.title,
                movie.duration,
                movie.genres,
                movie.posterUrl,
                movie.ageRating,
                movie.price
            );
            const tickets: Ticket[] = [];
            let remainingStandard = input.standardVisitors;
            const showtimeDate = new Date(input.showtime);
            for (const seatNumber of input.seatNumbers) {
                const visitorType = remainingStandard > 0 ? VisitorType.Standard : VisitorType.Discounted;
                if (remainingStandard > 0) remainingStandard--;
                const seat = Seat.create(seatNumber, visitorType);
                const ticket = Ticket.create(
                    movieInfo,
                    seat,
                    input.room,
                    showtimeDate
                );
                tickets.push(ticket);
            }


            const bookingId = BookingId.create(input.BookingId);
            const order = Order.create(
                BookingId.create(input.BookingId),
                tickets

            );

            this._logger.info('Created Order from booking', { order });
            await this._unitOfWork.save(order);
            return order.id.toString();
        });
        return result;
    }
}
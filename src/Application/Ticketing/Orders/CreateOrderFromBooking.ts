// import type {
//     Logger,
//     UnitOfWork,
//     UseCase
// } from "@/Application/Ports/mod.ts";
//
//
// export interface CreateOrderFromBookingInput {
//     BookingId: string;
//     MovieId: string;
//     Room: string;
//     Showtime: Date;
//     StandardVisitors: number;;
//     DiscountedVisitors: number;;
//     EatNumbers: string[];;
// }
// export class CreateOrderFromBooking implements UseCase<CreateOrderFromBookingInput, string> {
//     private readonly _unitOfWork: UnitOfWork;
//     private readonly _logger: Logger;
//
//     constructor(
//         unitOfWork: UnitOfWork,
//         logger: Logger,
//     ) {
//         this._unitOfWork = unitOfWork;
//         this._logger = logger;
//     }
//     async execute(input: CreateOrderFromBookingInput): Promise<string> {
//         this._logger.debug('Creating Order from booking', { input });
//         const result = await this._unitOfWork.do<string>(async () => {
//             const
//
//             this._logger.info('Created Order from booking', {  });
//             await this._unitOfWork.save();
//             return movie.id.toString();
//
//
//         });
//         return result;
//     }
// }
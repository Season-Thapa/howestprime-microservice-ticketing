import type { RouterContext, WebApiController } from "@/Infrastructure/WebApi/Shared/mod.ts";
import type { Logger, UseCase } from "@/Application/Ports/mod.ts";
import type { CreateOrderFromBookingUseCaseInput } from "@/Application/Ticketing/Orders/CreateOrderFromBooking.ts";

export class CreateOrderFromBookingController implements WebApiController {
  constructor(
    private readonly _useCase: UseCase<CreateOrderFromBookingUseCaseInput, string>,
    private readonly _logger: Logger,
  ) {}

  async handle(ctx: RouterContext<string>): Promise<void> {
    const body = await ctx.request.body.json();

    if (!this.validateBody(body)) {
      ctx.throw(400, "Invalid input for order creation from booking");
    }

    const payload = body as Record<string, unknown>;

    this._logger.info("Received request to create order from booking", {
      bookingId: payload.bookingId,
      movieId: payload.movieId,
      room: payload.room,
      showtime: payload.showtime,
      standardVisitors: payload.standardVisitors,
      discountedVisitors: payload.discountedVisitors,
      seatNumbers: payload.seatNumbers,
    });

    const id: string = await this._useCase.execute({
      bookingId: payload.bookingId as string,
      movieId: payload.movieId as string,
      room: payload.room as string,
      showtime: payload.showtime as string,
      standardVisitors: payload.standardVisitors as number,
      discountedVisitors: payload.discountedVisitors as number,
      seatNumbers: payload.seatNumbers as number[],
    });

    ctx.response.status = 201;
    ctx.response.body = { orderId: id };
  }

  private validateBody(body: unknown): boolean {
    if (typeof body !== "object" || body === null) {
      return false;
    }

    const payload = body as Record<string, unknown>;

    return (
      typeof payload.bookingId === "string" &&
      typeof payload.movieId === "string" &&
      typeof payload.room === "string" &&
      typeof payload.showtime === "string" &&
      typeof payload.standardVisitors === "number" &&
      typeof payload.discountedVisitors === "number" &&
      Array.isArray(payload.seatNumbers)
    );
  }
}

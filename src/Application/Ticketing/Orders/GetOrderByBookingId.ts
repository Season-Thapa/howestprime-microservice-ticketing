import type { FindOrderByBookingIdQueryPort, OrderData } from "@/Application/Ports/Queries/mod.ts";
import { UseCase } from "@/Application/Ports/UseCase.ts";

export type GetOrderByBookingIdInput = {
  bookingId: string;
};

export type GetOrderByBookingIdOutput = OrderData;

export class GetOrderByBookingId implements UseCase<GetOrderByBookingIdInput, GetOrderByBookingIdOutput> {
  private readonly _query: FindOrderByBookingIdQueryPort;
  constructor(query: FindOrderByBookingIdQueryPort) {
    this._query = query;
  }
  async execute(input: GetOrderByBookingIdInput): Promise<GetOrderByBookingIdOutput> {
    const resultOptional = await this._query.getOrderByBookingId(input.bookingId);
    if (!resultOptional.isPresent) {
      throw new Error(`Order not found for booking ID: ${input.bookingId}`);
    }
    return resultOptional.value;
  }
}

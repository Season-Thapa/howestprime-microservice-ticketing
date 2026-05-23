import type { GetOrderByBookingIdInput } from '@/Application/Ticketing/Orders/mod.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import type { OrderData } from '@/Application/Ports/Queries/mod.ts';
import {
    type RouterContext,
    type WebApiController,
    WebApiResult,
} from '@/Infrastructure/WebApi/Shared/mod.ts';
import { IllegalArgumentException } from '@domaincrafters/std';
import {NotFoundApplicationException} from "@/Application/Shared/mod.ts";

export class GetOrderByBookingIdController implements WebApiController {
    constructor(
        private readonly _getOrderByBookingIdUseCase: UseCase<
            GetOrderByBookingIdInput,
            OrderData
        >,
    ) {}
    async handle(ctx: RouterContext<string>): Promise<void> {
        const bookingId = this.extractBookingId(ctx);
        try {
            const orderData = await this._getOrderByBookingIdUseCase.execute({ bookingId });
            WebApiResult.ok(ctx, orderData);
        } catch {
            throw new NotFoundApplicationException(`Order not found for booking ID: ${bookingId}`);        }
    }
    private extractBookingId(ctx: RouterContext<string>): string {
        const bookingId = ctx.params.bookingId;
        if (typeof bookingId !== 'string' || bookingId.trim().length === 0) {
            throw new IllegalArgumentException('Route parameter bookingId is required.');
        }

        return bookingId;
    }
}

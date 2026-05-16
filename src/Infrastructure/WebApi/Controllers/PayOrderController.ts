import type { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import { WebApiResult } from '@/Infrastructure/WebApi/Shared/mod.ts';
import type { Logger, UseCase } from '@/Application/Ports/mod.ts';
import type { PayOrderInput } from '@/Application/Ticketing/Payments/PayOrderUseCase.ts';
import type { PaymentMethodType } from '@/Domain/Ticketing/Payments/mod.ts';

const validPaymentMethods = ['Credit Card', 'Bank Transfer'] as const;

export interface PayOrderRequest {
    externalId: unknown;
    paymentMethod: unknown;
    cardNumber: unknown;
    expiryDate: unknown;
    cvv: unknown;
    bookingId: unknown;
    amount: unknown;
}

export class PayOrderController implements WebApiController {
    constructor(
        private readonly _useCase: UseCase<PayOrderInput, string>,
        private readonly _logger: Logger,
    ) {}

    async handle(ctx: RouterContext<string>): Promise<void> {
        const orderId = ctx.params.orderId;
        if (typeof orderId !== 'string' || orderId.trim().length === 0) {
            ctx.throw(400, 'Order ID is required');
        }

        const body = await ctx.request.body.json();
        if (!this.validateBody(body)) {
            ctx.throw(400, 'Invalid input for payment processing');
        }

        const payload = body as Record<string, unknown>;

        this._logger.info('Received request to pay order', {
            orderId,
            bookingId: payload.bookingId,
            externalId: payload.externalId,
            paymentMethod: payload.paymentMethod,
            amount: payload.amount,
        });

        const paymentId = await this._useCase.execute({
            orderId,
            externalId: payload.externalId as string,
            paymentMethod: payload.paymentMethod as PaymentMethodType,
            cardNumber: payload.cardNumber as string,
            expiryDate: payload.expiryDate as string,
            cvv: payload.cvv as string,
            bookingId: payload.bookingId as string,
            amount: payload.amount as number,
        });

        WebApiResult.created(ctx, `/api/orders/${orderId}/payments/${paymentId}`);
        ctx.response.body = { paymentId };
    }

    private validateBody(body: unknown): boolean {
        if (typeof body !== 'object' || body === null) {
            return false;
        }

        const payload = body as Record<string, unknown>;

        return (
            typeof payload.externalId === 'string' &&
            typeof payload.cardNumber === 'string' &&
            typeof payload.expiryDate === 'string' &&
            typeof payload.cvv === 'string' &&
            typeof payload.bookingId === 'string' &&
            typeof payload.amount === 'number' &&
            typeof payload.paymentMethod === 'string' &&
            validPaymentMethods.includes(
                payload.paymentMethod as (typeof validPaymentMethods)[number],
            )
        );
    }
}

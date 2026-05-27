import type { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import type { Logger, UseCase } from '@/Application/Ports/mod.ts';
import type { AddCustomerToOrderUseCaseInput } from '@/Application/Ticketing/Orders/mod.ts';
import { WebApiResult } from '@/Infrastructure/WebApi/Shared/mod.ts';

export class AddCustomerToOrderController implements WebApiController {
    private readonly _useCase: UseCase<AddCustomerToOrderUseCaseInput, string>;
    private readonly _logger: Logger;
    constructor(useCase: UseCase<AddCustomerToOrderUseCaseInput, string>, logger: Logger) {
        this._useCase = useCase;
        this._logger = logger;
    }
    async handle(ctx: RouterContext<string>): Promise<void> {
        const orderId = ctx.params.orderId;

        if (!orderId || orderId === 'undefined') {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Order ID is required' };
            return;
        }
        const body = await ctx.request.body.json();
        this._logger.debug('AddCustomerToOrderController - Received request', {
            orderId: orderId,
            salutation: body.salutation,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            agreeToTerms: body.agreeToTerms,
        });
        if (!this.validateBody(body)) {
            ctx.throw(400, 'Invalid input for order from customer');
        }

        const input: AddCustomerToOrderUseCaseInput = {
            orderId,
            salutation: body.salutation,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            agreeToTerms: body.agreeToTerms,
        };
        const updatedOrderId = await this._useCase.execute(input);
        WebApiResult.created(ctx, `/api/orders/${updatedOrderId}`);
    }
    private validateBody(body: unknown): boolean {
        if (typeof body !== 'object' || body === null) {
            return false;
        }

        const payload = body as Record<string, unknown>;

        return (
            typeof payload.salutation === 'string' &&
            typeof payload.firstName === 'string' &&
            typeof payload.lastName === 'string' &&
            typeof payload.email === 'string' &&
            typeof payload.agreeToTerms === 'boolean'
        );
    }
}

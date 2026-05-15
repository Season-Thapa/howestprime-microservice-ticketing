import type { RouterContext, WebApiController } from '@/Infrastructure/WebApi/Shared/mod.ts';
import type { Logger, UseCase } from '@/Application/Ports/mod.ts';
import type { AddCustomerToOrderUseCaseInput } from '@/Application/Ticketing/Orders/mod.ts';

export class AddCustomerToOrderController implements WebApiController {
    private readonly _useCase: UseCase<AddCustomerToOrderUseCaseInput, string>;
    private readonly _logger: Logger;
    constructor(useCase: UseCase<AddCustomerToOrderUseCaseInput, string>, logger: Logger) {
        this._useCase = useCase;
        this._logger = logger;
    }
    async handle(ctx: RouterContext<string>): Promise<void> {
        console.log('AddCustomerToOrderController handling request');
        const orderId = ctx.params.id;

        if (!orderId) {
            ctx.response.status = 400;
            ctx.response.body = { error: 'Order ID is required' };
            return;
        }
        const body = await ctx.request.body.json();
        if (!this.validateBody(body)) {
            ctx.throw(400, 'Invalid input for order from customer');
        }
        this._logger.debug('AddCustomerToOrderController - Received request', {
            customerSalutation: body.customerSalutation,
            customerFirstName: body.customerFirstName,
            customerLastName: body.customerLastName,
            email: body.email,
            agreeToTerms: body.agreeToTerms,
        });
        const input: AddCustomerToOrderUseCaseInput = {
            orderId,
            customerSalutation: body.customerSalutation,
            customerFirstName: body.customerFirstName,
            customerLastName: body.customerLastName,
            email: body.email,
            agreeToTerms: body.agreeToTerms,
        };
        await this._useCase.execute(input);
        ctx.response.status = 200;
        ctx.response.body = { message: 'Customer added to order successfully' };
    }
    private validateBody(body: unknown): boolean {
        if (typeof body !== 'object' || body === null) {
            return false;
        }

        const payload = body as Record<string, unknown>;

        return (
            typeof payload.orderId === 'string' &&
            typeof payload.customerFirstName === 'string' &&
            typeof payload.customerLastName === 'string' &&
            typeof payload.customerEmail === 'string' &&
            typeof payload.customerSalutation === 'string' &&
            typeof payload.AgreeToTerms === 'boolean'
        );
    }
}

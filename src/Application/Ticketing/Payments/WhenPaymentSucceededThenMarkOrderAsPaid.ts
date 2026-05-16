import type { Policy, UseCase } from '@/Application/Ports/mod.ts';
import type { MarkOrderAsPaidInput } from '.././Orders/MarkOrderAsPaid.ts';
import { PaymentSuccess } from '@/Domain/Ticketing/Payments/mod.ts';

export class WhenPaymentSucceededThenMarkOrderAsPaid implements Policy<PaymentSuccess> {
    private readonly _markOrderAsPaidUseCase: UseCase<MarkOrderAsPaidInput, void>;

    constructor(markOrderAsPaidUseCase: UseCase<MarkOrderAsPaidInput, void>) {
        this._markOrderAsPaidUseCase = markOrderAsPaidUseCase;
    }

    async handle(event: PaymentSuccess): Promise<void> {
        console.log(
            `Received PaymentSuccess event for order ${event.orderId}, marking order as paid...`,
        );
        const input: MarkOrderAsPaidInput = {
            orderId: event.orderId,
        };
        await this._markOrderAsPaidUseCase.execute(input);
    }
}

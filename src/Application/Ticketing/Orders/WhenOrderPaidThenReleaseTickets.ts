import type { Policy, UseCase } from '@/Application/Ports/mod.ts';
import type { ReleaseTicketsInput } from './ReleaseTicket.ts';
import { OrderPaid } from '@/Domain/Ticketing/Orders/mod.ts';

export class WhenOrderPaidThenReleaseTickets implements Policy<OrderPaid> {
    private readonly _releaseTicketUseCase: UseCase<ReleaseTicketsInput, void>;

    constructor(releaseTicketUseCase: UseCase<ReleaseTicketsInput, void>) {
        this._releaseTicketUseCase = releaseTicketUseCase;
    }
    async handle(event: OrderPaid): Promise<void> {
        console.log('WhenOrderPaidThenReleaseTickets', {
            orderId: event.orderId,
        });

        const input: ReleaseTicketsInput = {
            orderId: event.orderId,
        };
        await this._releaseTicketUseCase.execute(input);
    }
}

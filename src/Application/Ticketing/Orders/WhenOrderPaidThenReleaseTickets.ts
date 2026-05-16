import type { Policy, UseCase } from '@/Application/Ports/mod.ts';
import type { ReleaseTicketInput } from './ReleaseTicket.ts';
import { TicketReleased } from '@/Domain/Ticketing/Orders/mod.ts';

export class WhenOrderPaidThenReleaseTickets implements Policy<TicketReleased> {
    private readonly _releaseTicketUseCase: UseCase<ReleaseTicketInput, void>;

    constructor(releaseTicketUseCase: UseCase<ReleaseTicketInput, void>) {
        this._releaseTicketUseCase = releaseTicketUseCase;
    }
    async handle(event: TicketReleased): Promise<void> {
        console.log('WhenOrderPaidThenReleaseTickets', {
            orderId: event.orderId,

        });

        const input: ReleaseTicketInput = {
            orderId: event.orderId,
        };
            await this._releaseTicketUseCase.execute(input);
        }

}
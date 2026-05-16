import type { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import {
    OrderId,
    BookingId
} from '@/Domain/Ticketing/Orders/mod.ts';
import {
    Payment,
    PaymentMethod,
    PaymentAmount,
    PaymentMethodType,
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId

} from "@/Domain/Ticketing/Payments/mod.ts";

export interface PayOrderInput {
    orderId: string;
    externalId: string;
    paymentMethod: PaymentMethodType;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    bookingId: string;
    amount: number;
}
export class PayOrderUseCase implements UseCase<PayOrderInput, string> {
    private readonly _unitOfWork: UnitOfWork;
    private readonly _logger: Logger;

    constructor(
        unitOfWork: UnitOfWork,
        logger: Logger,
    ) {
        this._unitOfWork = unitOfWork;
        this._logger = logger;
    }

    async execute(input: PayOrderInput): Promise<string> {
        this._logger.debug('Starting o  rder payment process', {input});
        const result = await this._unitOfWork.do<string>(async () => {

            const payment = Payment.create(
                PaymentMethod.create(input.paymentMethod),
                CardNumber.create(input.cardNumber),
                ExpiryDate.create(input.expiryDate),
                CVV.create(input.cvv),
                OrderId.create(input.orderId),
                BookingId.create(input.bookingId),
                PaymentAmount.create(input.amount),
                ExternalId.create(input.externalId)
            );

            await this._unitOfWork.save(payment);

            return payment.id.toString();
        });

        return result;
    }

}

import type { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import type { PaymentService } from '@/Application/Ports/Gateways/mod.ts';
import { BookingId, OrderId, OrderRepository } from '@/Domain/Ticketing/Orders/mod.ts';
import {
    CardNumber,
    CVV,
    ExpiryDate,
    ExternalId,
    FailureReason,
    Payment,
    PaymentAmount,
    PaymentMethod,
    type PaymentMethodType,
} from '@/Domain/Ticketing/Payments/mod.ts';

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
    private readonly _paymentService: PaymentService;

    constructor(unitOfWork: UnitOfWork, logger: Logger, paymentService: PaymentService) {
        this._unitOfWork = unitOfWork;
        this._logger = logger;
        this._paymentService = paymentService;
    }

    async execute(input: PayOrderInput): Promise<string> {
        this._logger.debug('Starting order payment process', {
            orderId: input.orderId,
            bookingId: input.bookingId,
            amount: input.amount,
            paymentMethod: input.paymentMethod,
            externalId: input.externalId,
        });
        const result = await this._unitOfWork.do<string>(async () => {
            // Validate order exists and bookingId belongs to that order
            const orderRepository = this._unitOfWork.getRepository<OrderRepository>('Order');
            const orderId = OrderId.create(input.orderId);
            const orderOptional = await orderRepository.findById(orderId);

            if (!orderOptional.isPresent) {
                throw new Error(
                    `Order with ID ${input.orderId} not found. Ensure OrderCreated event was processed.`,
                );
            }

            const order = orderOptional.getOrThrow(
                `Order with ID ${input.orderId} should be present.`,
            );
            if (order.bookingId.toString() !== input.bookingId) {
                throw new Error(
                    `Booking ID ${input.bookingId} does not match order ${input.orderId}.`,
                );
            }

            const payment = Payment.create(
                PaymentMethod.create(input.paymentMethod),
                CardNumber.create(input.cardNumber),
                ExpiryDate.create(input.expiryDate),
                CVV.create(input.cvv),
                OrderId.create(input.orderId),
                BookingId.create(input.bookingId),
                PaymentAmount.create(input.amount),
                ExternalId.create(input.externalId),
            );

            await this._unitOfWork.save(payment);

            const paymentResult = await this._paymentService
                .pay({
                    amount: input.amount,
                    cardNumber: input.cardNumber,
                    expiryDate: input.expiryDate,
                    cvv: input.cvv,
                    paymentMethod: input.paymentMethod,
                })
                .catch((error: unknown) => ({
                    success: false,
                    failureReason: error instanceof Error ? error.message : 'Payment gateway error',
                }));

            if (paymentResult.success) {
                payment.markAsSuccess(ExternalId.create(input.externalId));
            } else {
                payment.markAsFailed(
                    FailureReason.create(
                        paymentResult.failureReason ?? 'Payment declined by provider',
                    ),
                );
            }

            await this._unitOfWork.save(payment);

            return payment.id.toString();
        });

        return result;
    }
}

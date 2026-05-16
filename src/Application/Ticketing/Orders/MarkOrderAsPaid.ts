import type { Logger, UnitOfWork, UseCase } from "@/Application/Ports/mod.ts";
import { OrderId, OrderRepository } from "@/Domain/Ticketing/Orders/mod.ts";

export interface MarkOrderAsPaidInput {
  orderId: string;
}

export class MarkOrderAsPaid implements UseCase<MarkOrderAsPaidInput, void> {
  private readonly _unitOfWork: UnitOfWork;
  private readonly _logger: Logger;

  constructor(unitOfWork: UnitOfWork, logger: Logger) {
    this._unitOfWork = unitOfWork;
    this._logger = logger;
  }

  async execute(input: MarkOrderAsPaidInput): Promise<void> {
    this._logger.debug("Marking order as paid", { orderId: input.orderId });
    await this._unitOfWork.do<void>(async () => {
      const orderId = OrderId.create(input.orderId);
      const orderRepository = this._unitOfWork.getRepository<OrderRepository>("Order");
      const orderOptional = await orderRepository.findById(orderId);

      if (!orderOptional.isPresent) {
        this._logger.warn("Order not found", { orderId: input.orderId });
        return;
      }

      const order = orderOptional.value;
      order.markAsPaid();
      await this._unitOfWork.save(order);
      this._logger.info("Order marked as paid", { orderId: input.orderId });
    });
  }
}

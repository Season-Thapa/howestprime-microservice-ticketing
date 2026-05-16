import type { Logger, UnitOfWork, UseCase } from "@/Application/Ports/mod.ts";
import { OrderId, OrderRepository } from "@/Domain/Ticketing/Orders/mod.ts";

export interface ReleaseTicketsInput {
  orderId: string;
}
export class ReleaseTickets implements UseCase<ReleaseTicketsInput, void> {
  private readonly _unitOfWork: UnitOfWork;
  private readonly _logger: Logger;

  constructor(unitOfWork: UnitOfWork, logger: Logger) {
    this._unitOfWork = unitOfWork;
    this._logger = logger;
  }

  async execute(input: ReleaseTicketsInput): Promise<void> {
    this._logger.debug("Releasing tickets for order", { orderId: input.orderId });
    await this._unitOfWork.do<void>(async () => {
      const orderId = OrderId.create(input.orderId);
      const orderRepository = this._unitOfWork.getRepository<OrderRepository>("Order");
      const orderOptional = await orderRepository.findById(orderId);
      if (!orderOptional.isPresent) {
        this._logger.warn("Order not found", { orderId: input.orderId });
        return;
      }

      const order = orderOptional.value;
      order.releaseTickets();
      await this._unitOfWork.save(order);
      this._logger.info("Tickets released for order", { orderId: input.orderId });
    });
  }
}

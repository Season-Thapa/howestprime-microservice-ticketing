import type { Logger, UnitOfWork, UseCase } from "@/Application/Ports/mod.ts";

import { Customer, CustomerFirstName, CustomerLastName, CustomerSalutation, OrderId } from "@/Domain/Ticketing/Orders/mod.ts";
import type { OrderRepository } from "@/Domain/Ticketing/Orders/mod.ts";
import { Email } from "@/Domain/Shared/ValueObjects/Email.ts";

export interface AddCustomerToOrderUseCaseInput {
  orderId: string;
  customerSalutation: CustomerSalutation;
  customerFirstName: string;
  customerLastName: string;
  email: string;
  agreeToTerms: boolean;
}
export class AddCustomerToOrder implements UseCase<AddCustomerToOrderUseCaseInput, string> {
  private readonly _unitOfWork: UnitOfWork;
  private readonly _logger: Logger;

  constructor(unitOfWork: UnitOfWork, logger: Logger) {
    this._unitOfWork = unitOfWork;
    this._logger = logger;
  }
  async execute(input: AddCustomerToOrderUseCaseInput): Promise<string> {
    this._logger.debug("Adding Customer to Order", { input });

    const result = await this._unitOfWork.do<string>(async () => {
      const orderRepository = this._unitOfWork.getRepository<OrderRepository>("Order");
      const orderId = OrderId.create(input.orderId);
      const orderOptional = await orderRepository.findById(orderId);

      if (!orderOptional.isPresent) {
        throw new Error(`Order with ID ${input.orderId} not found. Ensure OrderCreated event was processed.`);
      }

      const order = orderOptional.getOrThrow(`Order with ID ${input.orderId} should be present.`);
      if (input.agreeToTerms === true) {
        order.acceptTerms();
      }

      const customer = Customer.create(
        input.customerSalutation,
        CustomerFirstName.create(input.customerFirstName),
        CustomerLastName.create(input.customerLastName),
        Email.create(input.email),
      );
      order.setCustomer(customer);

      await this._unitOfWork.save(order);
      return order.id.toString();
    });
    return result;
  }
}

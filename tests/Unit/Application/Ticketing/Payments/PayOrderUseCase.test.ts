import { assertEquals, assertStringIncludes } from "@std/assert";

import { PayOrderUseCase, type PayOrderInput } from "@/Application/Ticketing/Payments/PayOrderUseCase.ts";
import { createMockDomainEventBus, createMockOnlinePaymentService, createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import type { Logger } from "@/Application/Ports/mod.ts";
import { Payment, PaymentStatusState } from "@/Domain/Ticketing/Payments/mod.ts";

const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

function createInput(overrides: Partial<PayOrderInput> = {}): PayOrderInput {
  return {
    orderId: crypto.randomUUID(),
    externalId: crypto.randomUUID(),
    paymentMethod: "Credit Card",
    cardNumber: "4111111111111111",
    expiryDate: "12/28",
    cvv: "123",
    bookingId: crypto.randomUUID(),
    amount: 42.5,
    ...overrides,
  };
}

Deno.test("PayOrderUseCase - creates, charges, and succeeds a payment", async () => {
  const eventBus = createMockDomainEventBus();
  const unitOfWork = createMockUnitOfWork({ eventBus });
  const paymentService = createMockOnlinePaymentService({
    defaultResponse: { success: true },
  });
  const useCase = new PayOrderUseCase(unitOfWork, mockLogger, paymentService);
  const input = createInput();

  const paymentId = await useCase.execute(input);

  assertStringIncludes(paymentId, "-");
  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 2);
  assertEquals(paymentService.payCalled, true);
  assertEquals(paymentService.payCallCount, 1);
  assertEquals(eventBus.publishCallCount, 1);
  assertEquals(eventBus.publishedEvents[0].constructor.name, "PaymentSuccess");

  const savedPayment = unitOfWork.savedEntities.at(-1) as Payment;
  assertEquals(savedPayment.status.value, PaymentStatusState.Success);
});

Deno.test("PayOrderUseCase - records a failed payment when the gateway declines", async () => {
  const eventBus = createMockDomainEventBus();
  const unitOfWork = createMockUnitOfWork({ eventBus });
  const paymentService = createMockOnlinePaymentService({
    defaultResponse: { success: false, failureReason: "Payment declined by provider" },
  });
  const useCase = new PayOrderUseCase(unitOfWork, mockLogger, paymentService);
  const input = createInput({ amount: 19.99 });

  const paymentId = await useCase.execute(input);

  assertStringIncludes(paymentId, "-");
  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 2);
  assertEquals(paymentService.payCalled, true);
  assertEquals(paymentService.payCallCount, 1);
  assertEquals(eventBus.publishCallCount, 1);
  assertEquals(eventBus.publishedEvents[0].constructor.name, "PaymentFailed");

  const savedPayment = unitOfWork.savedEntities.at(-1) as Payment;
  assertEquals(savedPayment.status.value, PaymentStatusState.Failed);
});

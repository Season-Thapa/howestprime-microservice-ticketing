import { assertEquals, assertStringIncludes } from "@std/assert";

import { PayOrderUseCase, type PayOrderInput } from "@/Application/Ticketing/Payments/PayOrderUseCase.ts";
import { createMockDomainEventBus, createMockOnlinePaymentService, createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import { BookingId, Order, OrderId, MovieInfo } from "@/Domain/Ticketing/Orders/mod.ts";
import { MovieDuration, Genre, PosterUrl, AgeRating } from "@/Domain/Shared/mod.ts";
import { MovieId, MovieTitle } from "@/Domain/Ticketing/Movies/mod.ts";
import { Ticket } from "@/Domain/Ticketing/Orders/Entities/Ticket.ts";
import { Seat, VisitorType } from "@/Domain/Ticketing/Orders/ValueObjects/Seat.ts";
import { Money } from "@/Domain/Shared/mod.ts";
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
    paymentMethod: "Credit Card" as any,
    cardNumber: "4111111111111111",
    expiryDate: "12/28",
    cvv: "123",
    bookingId: crypto.randomUUID(),
    amount: 42.5,
    ...overrides,
  };
}

function createTestOrder(orderId: string, bookingId: string): Order {
  const movieInfo = MovieInfo.create(
    MovieId.create(crypto.randomUUID()),
    MovieTitle.create("Test Movie"),
    MovieDuration.create(120),
    [Genre.create("Drama")],
    PosterUrl.create("https://example.com/poster.jpg"),
    AgeRating.create("12+"),
    Money.create(12.5),
  );

  const ticket = Ticket.create(movieInfo, Seat.create(12, VisitorType.Standard), "Room A", new Date("2026-05-15T18:30:00.000Z"));

  const order = Order.create(BookingId.create(bookingId), [ticket]);
  const snapshot = Object.create(Order.prototype) as Order;

  return Object.assign(snapshot, {
    _id: OrderId.create(orderId),
    _bookingId: order.bookingId,
    _customer: null,
    _tickets: order.tickets,
    _price: order.price,
    _status: order.status,
    _agreeToTerms: false,
    _domainEvents: [],
  });
}

Deno.test("PayOrderUseCase - creates, charges, and succeeds a payment", async () => {
  const eventBus = createMockDomainEventBus();
  const input = createInput();
  const order = createTestOrder(input.orderId, input.bookingId);

  const mockOrderRepository = {
    findById: async () => ({ isPresent: true, getOrThrow: () => order, get: () => order }),
    save: async () => {},
    remove: async () => {},
  } as any;

  const unitOfWork = createMockUnitOfWork({ eventBus, repositories: new Map([["Order", mockOrderRepository]]) });
  const paymentService = createMockOnlinePaymentService({
    defaultResponse: { success: true },
  });
  const useCase = new PayOrderUseCase(unitOfWork, mockLogger, paymentService);

  const paymentId = await useCase.execute(input);

  assertStringIncludes(paymentId, "-");
  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 2);
  assertEquals(paymentService.payCalled, true);
  assertEquals(paymentService.payCallCount, 1);
  assertEquals(eventBus.publishCallCount, 1);
  assertEquals(eventBus.publishedEvents[0]!.constructor.name, "PaymentSuccess");

  const savedPayment = unitOfWork.savedEntities.at(-1) as Payment;
  assertEquals(savedPayment.status.value, PaymentStatusState.Success);
});

Deno.test("PayOrderUseCase - records a failed payment when the gateway declines", async () => {
  const eventBus2 = createMockDomainEventBus();
  const input2 = createInput({ amount: 19.99 });
  const order2 = createTestOrder(input2.orderId, input2.bookingId);

  const mockOrderRepository2 = {
    findById: async () => ({ isPresent: true, getOrThrow: () => order2, get: () => order2 }),
    save: async () => {},
    remove: async () => {},
  } as any;

  const unitOfWork = createMockUnitOfWork({ eventBus: eventBus2, repositories: new Map([["Order", mockOrderRepository2]]) });
  const paymentService = createMockOnlinePaymentService({
    defaultResponse: { success: false, failureReason: "Payment declined by provider" },
  });
  const useCase = new PayOrderUseCase(unitOfWork, mockLogger, paymentService);
  const input = input2;

  const paymentId = await useCase.execute(input);

  assertStringIncludes(paymentId, "-");
  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 2);
  assertEquals(paymentService.payCalled, true);
  assertEquals(paymentService.payCallCount, 1);
  assertEquals(eventBus2.publishCallCount, 1);
  assertEquals(eventBus2.publishedEvents[0]!.constructor.name, "PaymentFailed");

  const savedPayment = unitOfWork.savedEntities.at(-1) as Payment;
  assertEquals(savedPayment.status.value, PaymentStatusState.Failed);
});

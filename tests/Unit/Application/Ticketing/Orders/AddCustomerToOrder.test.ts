import { assertEquals, assertRejects } from "@std/assert";
import { Optional } from "@domaincrafters/std";

import { AddCustomerToOrder, type AddCustomerToOrderUseCaseInput } from "@/Application/Ticketing/Orders/AddCustomerToOrder.ts";
import { createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import type { Logger } from "@/Application/Ports/mod.ts";
import { AgeRating, Genre, MovieId, MovieTitle, MovieDuration, PosterUrl, type Movie } from "@/Domain/Ticketing/Movies/mod.ts";
import { BookingId, CustomerFirstName, CustomerLastName, CustomerSalutation, MovieInfo, Order, OrderId } from "@/Domain/Ticketing/Orders/mod.ts";
import { Ticket } from "@/Domain/Ticketing/Orders/Entities/Ticket.ts";
import { Seat, VisitorType } from "@/Domain/Ticketing/Orders/ValueObjects/Seat.ts";
import { Money } from "@/Domain/Shared/mod.ts";
import { Email } from "@/Domain/Shared/ValueObjects/Email.ts";

const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

function createTestOrder(orderId: string): Order {
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

  const order = Order.create(BookingId.create(crypto.randomUUID()), [ticket]);
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

Deno.test("AddCustomerToOrder - successfully adds customer and accepts terms", async () => {
  const orderId = crypto.randomUUID();
  const order = createTestOrder(orderId);
  let savedOrder: Order | undefined;

  const mockOrderRepository = {
    findById: async () => Optional.of(order),
    save: async (value: Order) => {
      savedOrder = value;
    },
    remove: async () => {},
  };

  const mockUow = createMockUnitOfWork({
    repositories: new Map([["Order", mockOrderRepository as any]]),
  });

  const useCase = new AddCustomerToOrder(mockUow, mockLogger);

  const input: AddCustomerToOrderUseCaseInput = {
    orderId,
    customerSalutation: CustomerSalutation.Mr,
    customerFirstName: "John",
    customerLastName: "Doe",
    email: "john.doe@example.com",
    agreeToTerms: true,
  };

  const result = await useCase.execute(input);

  assertEquals(result, orderId);
  assertEquals(mockUow.doCalled, true);
  assertEquals(mockUow.saveCalled, true);
  assertEquals(mockUow.saveCallCount, 1);

  const persistedOrder = savedOrder;
  if (!persistedOrder) {
    throw new Error("Expected order to be saved");
  }

  assertEquals(persistedOrder.agreeToTerms, true);
  assertEquals(persistedOrder.customer?.salutation, CustomerSalutation.Mr);
  assertEquals(persistedOrder.customer?.firstName, CustomerFirstName.create("John"));
  assertEquals(persistedOrder.customer?.lastName, CustomerLastName.create("Doe"));
  assertEquals(persistedOrder.customer?.email, Email.create("john.doe@example.com"));
});

Deno.test("AddCustomerToOrder - throws error when order does not exist", async () => {
  const orderId = crypto.randomUUID();

  const mockOrderRepository = {
    findById: async () => Optional.empty(),
    save: async () => {},
    remove: async () => {},
  };

  const mockUow = createMockUnitOfWork({
    repositories: new Map([["Order", mockOrderRepository as any]]),
  });

  const useCase = new AddCustomerToOrder(mockUow, mockLogger);

  const input: AddCustomerToOrderUseCaseInput = {
    orderId,
    customerSalutation: CustomerSalutation.Mr,
    customerFirstName: "John",
    customerLastName: "Doe",
    email: "john.doe@example.com",
    agreeToTerms: true,
  };

  await assertRejects(async () => await useCase.execute(input), Error, `Order with ID ${orderId} not found`);
});

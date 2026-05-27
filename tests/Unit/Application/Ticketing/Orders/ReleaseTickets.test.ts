import { assertEquals } from "@std/assert";

import { ReleaseTickets } from "@/Application/Ticketing/Orders/ReleaseTicket.ts";
import { createMockDomainEventBus, createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import { Order, BookingId, MovieInfo, OrderStatus, OrderStatusState } from "@/Domain/Ticketing/Orders/mod.ts";
import { TicketReleased } from "@/Domain/Ticketing/Orders/Events/TicketReleased.ts";
import { MovieId, MovieTitle, MovieDuration, Genre, PosterUrl, AgeRating } from "@/Domain/Ticketing/Movies/mod.ts";
import { Ticket } from "@/Domain/Ticketing/Orders/Entities/Ticket.ts";
import { Seat, VisitorType } from "@/Domain/Ticketing/Orders/ValueObjects/Seat.ts";
import { Money, Email } from "@/Domain/Shared/mod.ts";
import { Customer, CustomerSalutation, CustomerFirstName, CustomerLastName } from "@/Domain/Ticketing/Orders/mod.ts";
import type { Logger } from "@/Application/Ports/mod.ts";

const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

function createOrder(withCustomer = true): Order {
  const movieInfo = MovieInfo.create(
    MovieId.create(crypto.randomUUID()),
    "external-id",
    MovieTitle.create("Test Movie"),
    MovieDuration.create(120),
    [Genre.create("Drama")],
    PosterUrl.create("https://example.com/poster.jpg"),
    AgeRating.create("12+"),
    Money.create(15),
  );

  const ticket = Ticket.create(movieInfo, Seat.create(1, VisitorType.Standard), "Room A", new Date("2026-05-15T18:30:00.000Z"));
  const order = Order.create(BookingId.create(crypto.randomUUID()), [ticket]);
  order.acceptTerms();

  if (withCustomer) {
    order.setCustomer(
      Customer.create(CustomerSalutation.Mr, CustomerFirstName.create("John"), CustomerLastName.create("Doe"), Email.create("john.doe@example.com")),
    );
  }

  return order;
}

Deno.test("ReleaseTickets - marks paid order as ticket released and emits event", async () => {
  const order = createOrder(true);
  Object.assign(order, {
    _status: OrderStatus.create(OrderStatusState.Paid),
    _domainEvents: [],
  });

  const mockOrderRepository = {
    findById: async () => ({ isPresent: true, value: order, getOrThrow: () => order, get: () => order }),
    save: async (_: any) => {},
  } as any;

  const eventBus = createMockDomainEventBus();
  const unitOfWork = createMockUnitOfWork({
    eventBus,
    repositories: new Map([["Order", mockOrderRepository]]),
  });

  const useCase = new ReleaseTickets(unitOfWork, mockLogger);
  await useCase.execute({ orderId: order.id.value });

  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 1);
  assertEquals(order.status.value, "TicketReleased");
  assertEquals(eventBus.publishCallCount, 1);
  const publishedEvent = eventBus.publishedEvents[0];
  if (!(publishedEvent instanceof TicketReleased)) {
    throw new Error("Expected TicketReleased event");
  }
  assertEquals(publishedEvent.orderId, order.id.value);
  assertEquals(publishedEvent.tickets.length, 1);
  assertEquals(publishedEvent.customer?.email, "john.doe@example.com");
});

Deno.test("ReleaseTickets - does nothing when order is missing", async () => {
  const eventBus = createMockDomainEventBus();
  const mockOrderRepository = {
    findById: async () => ({ isPresent: false, value: undefined }),
    save: async (_: any) => {},
  } as any;

  const unitOfWork = createMockUnitOfWork({ eventBus, repositories: new Map([["Order", mockOrderRepository]]) });
  const useCase = new ReleaseTickets(unitOfWork, mockLogger);

  await useCase.execute({ orderId: crypto.randomUUID() });

  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 0);
  assertEquals(eventBus.publishCallCount, 0);
});

import { assertEquals } from "@std/assert";

import { MarkOrderAsPaid } from "@/Application/Ticketing/Orders/MarkOrderAsPaid.ts";
import { createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import { Order, BookingId, MovieInfo } from "@/Domain/Ticketing/Orders/mod.ts";
import { MovieId, MovieTitle, MovieDuration, Genre, PosterUrl, AgeRating } from "@/Domain/Ticketing/Movies/mod.ts";
import { Ticket } from "@/Domain/Ticketing/Orders/Entities/Ticket.ts";
import { Seat, VisitorType } from "@/Domain/Ticketing/Orders/ValueObjects/Seat.ts";
import { Money } from "@/Domain/Shared/mod.ts";
import type { Logger } from "@/Application/Ports/mod.ts";

const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

function createOrder(): Order {
  const mi = MovieInfo.create(
    MovieId.create(crypto.randomUUID()),
    MovieTitle.create("Test Movie"),
    MovieDuration.create(90),
    [Genre.create("Drama")],
    PosterUrl.create("https://example.com/poster.jpg"),
    AgeRating.create("12+"),
    Money.create(10),
  );

  const ticket = Ticket.create(mi, Seat.create(1, VisitorType.Standard), "Room", new Date());
  const order = Order.create(BookingId.create(crypto.randomUUID()), [ticket]);
  order.acceptTerms();
  return order;
}

Deno.test("MarkOrderAsPaid - marks existing order as paid", async () => {
  const order = createOrder();

  const mockOrderRepository = {
    findById: async () => ({ isPresent: true, value: order, getOrThrow: () => order, get: () => order }),
    save: async (_: any) => {},
  } as any;

  const unitOfWork = createMockUnitOfWork({ repositories: new Map([["Order", mockOrderRepository]]) });

  const useCase = new MarkOrderAsPaid(unitOfWork, mockLogger);

  await useCase.execute({ orderId: crypto.randomUUID() });

  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 1);
  assertEquals(order.status.value, "Paid");
});

Deno.test("MarkOrderAsPaid - does nothing when order not found", async () => {
  const mockOrderRepository = {
    findById: async () => ({ isPresent: false, value: undefined }),
    save: async (_: any) => {},
  } as any;

  const unitOfWork = createMockUnitOfWork({ repositories: new Map([["Order", mockOrderRepository]]) });
  const useCase = new MarkOrderAsPaid(unitOfWork, mockLogger);

  await useCase.execute({ orderId: crypto.randomUUID() });

  assertEquals(unitOfWork.doCalled, true);
  assertEquals(unitOfWork.saveCallCount, 0);
});

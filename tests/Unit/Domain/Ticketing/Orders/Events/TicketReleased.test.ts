import { assertEquals } from "@std/assert";

import { TicketReleased } from "@/Domain/Ticketing/Orders/mod.ts";

Deno.test("TicketReleased - exposes payload and fqdn", () => {
  const event = TicketReleased.create(
    crypto.randomUUID(),
    {
      salutation: "Mr.",
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
    },
    [
      {
        ticketId: crypto.randomUUID(),
        movieId: crypto.randomUUID(),
        room: "Room A",
        seatNumber: 12,
        visitorType: "standard",
        price: 15,
        showtime: new Date("2026-05-15T18:30:00.000Z"),
      },
    ],
  );

  assertEquals(event.orderId.length > 0, true);
  assertEquals(event.customer?.email, "john.doe@example.com");
  assertEquals(event.tickets.length, 1);
  assertEquals(event.FQDN.value, "howestprime.ticketing.order.ticketreleased");
  assertEquals(event.occurredOn instanceof Date, true);
});

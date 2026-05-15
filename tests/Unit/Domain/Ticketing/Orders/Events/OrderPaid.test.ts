import { assertEquals } from "@std/assert";

import { OrderPaid } from "@/Domain/Ticketing/Orders/mod.ts";

Deno.test("OrderPaid - exposes payload and fqdn", () => {
  const event = OrderPaid.create(crypto.randomUUID(), crypto.randomUUID());

  assertEquals(event.orderId.length > 0, true);
  assertEquals(event.bookingId.length > 0, true);
  assertEquals(event.FQDN.value, "howestprime.ticketing.order.order-paid");
  assertEquals(event.occurredOn instanceof Date, true);
});

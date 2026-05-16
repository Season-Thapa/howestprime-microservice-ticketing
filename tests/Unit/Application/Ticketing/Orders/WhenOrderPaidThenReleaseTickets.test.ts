import { assertEquals } from "@std/assert";

import { WhenOrderPaidThenReleaseTickets } from "@/Application/Ticketing/Orders/WhenOrderPaidThenReleaseTickets.ts";
import { OrderPaid } from "@/Domain/Ticketing/Orders/mod.ts";

Deno.test("WhenOrderPaidThenReleaseTickets - forwards orderId to ReleaseTickets use-case", async () => {
  let executed = false;
  const received: { orderId: string }[] = [];

  const mockUseCase = {
    execute: async (input: { orderId: string }) => {
      executed = true;
      received.push(input);
    },
  } as any;

  const policy = new WhenOrderPaidThenReleaseTickets(mockUseCase);
  const event = OrderPaid.create(crypto.randomUUID(), crypto.randomUUID());

  await policy.handle(event);

  assertEquals(executed, true);
  assertEquals(received.length, 1);
  assertEquals(received[0]!.orderId, event.orderId);
});

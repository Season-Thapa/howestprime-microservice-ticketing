import { assertEquals } from "@std/assert";

import { WhenPaymentSucceededThenMarkOrderAsPaid } from "@/Application/Ticketing/Payments/WhenPaymentSucceededThenMarkOrderAsPaid.ts";
import { PaymentSuccess } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("WhenPaymentSucceededThenMarkOrderAsPaid - forwards orderId to MarkOrderAsPaid use-case", async () => {
  let executed = false;
  let received: any = null;

  const mockUseCase = {
    execute: async (input: any) => {
      executed = true;
      received = input;
    },
  } as any;

  const policy = new WhenPaymentSucceededThenMarkOrderAsPaid(mockUseCase);

  const event = PaymentSuccess.create(crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID());

  await policy.handle(event);

  assertEquals(executed, true);
  assertEquals(received.orderId, event.orderId);
});

import { assertEquals, assert } from "@std/assert";

import { PaymentFailed } from "@/Domain/Ticketing/Payments/Events/PaymentFailed.ts";
import { PaymentDomainEvent } from "@/Domain/Ticketing/Payments/Events/PaymentDomainEvent.ts";

Deno.test("PaymentFailed - properties, reason and FQDN", () => {
  const paymentId = "pay-2";
  const orderId = "order-2";
  const bookingId = "book-2";
  const reason = "Insufficient funds";

  const ev = PaymentFailed.create(paymentId, orderId, bookingId, reason);

  assertEquals(ev.paymentId, paymentId);
  assertEquals(ev.orderId, orderId);
  assertEquals(ev.bookingId, bookingId);
  assertEquals(ev.reason, reason);
  assert(ev.occurredOn instanceof Date);
  assertEquals(ev.FQDN.value, `${(PaymentDomainEvent as any).FQDN_PREFIX}.paymentfailed`);
});

import { assertEquals, assert } from "@std/assert";

import { PaymentSuccess } from "@/Domain/Ticketing/Payments/Events/PaymentSuccess.ts";
import { PaymentDomainEvent } from "@/Domain/Ticketing/Payments/Events/PaymentDomainEvent.ts";

Deno.test("PaymentSuccess - properties and FQDN", () => {
  const paymentId = "pay-1";
  const orderId = "order-1";
  const bookingId = "book-1";

  const ev = PaymentSuccess.create(paymentId, orderId, bookingId);

  assertEquals(ev.paymentId, paymentId);
  assertEquals(ev.orderId, orderId);
  assertEquals(ev.bookingId, bookingId);
  assert(ev.occurredOn instanceof Date);
  assertEquals(ev.FQDN.value, `${(PaymentDomainEvent as any).FQDN_PREFIX}.paymentsuccess`);
});

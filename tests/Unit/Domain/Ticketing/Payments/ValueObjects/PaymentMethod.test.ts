import { assertEquals, assertThrows } from "@std/assert";

import { PaymentMethod, PaymentMethodType } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("PaymentMethod - valid and invalid", () => {
  const pm = PaymentMethod.create(PaymentMethodType.CreditCard);
  assertEquals(pm.value, PaymentMethodType.CreditCard);
  assertThrows(() => PaymentMethod.create("Cash" as any), Error);
});

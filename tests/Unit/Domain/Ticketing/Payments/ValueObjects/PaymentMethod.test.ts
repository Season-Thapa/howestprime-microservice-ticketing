import { assertEquals, assertThrows } from "@std/assert";

import { PaymentMethod, PaymentMethodType } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("PaymentMethod - valid and invalid", () => {
  const pm = PaymentMethod.create(PaymentMethodType.CreditCard);
  assertEquals(pm.value, PaymentMethodType.CreditCard);
  assertThrows(() => PaymentMethod.create("Cash" as any), Error);
  
  // equals and toString
  const pm2 = PaymentMethod.create(PaymentMethodType.CreditCard);
  const pm3 = PaymentMethod.create(PaymentMethodType.BankTransfer);
  assertEquals(pm.equals(pm2), true);
  assertEquals(pm.equals(pm3), false);
  // equals handles undefined gracefully
  assertEquals(pm.equals(undefined as any), false);
  // toString returns the enum value
  assertEquals(pm.toString(), PaymentMethodType.CreditCard);
});

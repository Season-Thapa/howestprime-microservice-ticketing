import { assertEquals, assertThrows } from "@std/assert";

import { PaymentAmount, InvalidPaymentAmountException } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("PaymentAmount - valid and equals", () => {
  const a = PaymentAmount.create(19.99);
  const b = PaymentAmount.create(19.99);
  assertEquals(a.value, 19.99);
  assertEquals(a.equals(b), true);
});

Deno.test("PaymentAmount - invalid throws", () => {
  assertThrows(() => PaymentAmount.create(0), InvalidPaymentAmountException);
  assertThrows(() => PaymentAmount.create(Number.NaN), InvalidPaymentAmountException);
});

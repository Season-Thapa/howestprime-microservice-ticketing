import { assertEquals, assertThrows } from "@std/assert";

import { PaymentStatus, InvalidPaymentStatusTransitionException } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("PaymentStatus - transitions and invalid transitions", () => {
  const pending = PaymentStatus.Pending;
  const success = PaymentStatus.Success;
  const failed = PaymentStatus.Failed;

  // valid transitions
  const toSuccess = pending.transitionTo(success);
  assertEquals(toSuccess.equals(success), true);

  const toFailed = pending.transitionTo(failed);
  assertEquals(toFailed.equals(failed), true);

  // invalid transitions
  assertThrows(() => success.transitionTo(failed), InvalidPaymentStatusTransitionException);
  assertThrows(() => failed.transitionTo(success), InvalidPaymentStatusTransitionException);
});

Deno.test("PaymentStatus - rejects transition to same status", () => {
  const pending = PaymentStatus.Pending;

  assertThrows(() => pending.transitionTo(PaymentStatus.Pending), InvalidPaymentStatusTransitionException, "already in this status");
});

Deno.test("PaymentStatus - equals handles nullish and value getter", () => {
  const pending = PaymentStatus.Pending;

  assertEquals(pending.value, "Pending");
  assertEquals(pending.equals(PaymentStatus.Pending), true);
  assertEquals(pending.equals(PaymentStatus.Success), false);
  assertEquals(pending.equals(null as unknown as PaymentStatus), false);
});

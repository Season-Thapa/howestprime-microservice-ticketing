import { assertEquals, assertThrows } from "@std/assert";

import { PaymentStatus } from "@/Domain/Ticketing/Payments/mod.ts";

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
  assertThrows(() => success.transitionTo(failed), Error);
  assertThrows(() => failed.transitionTo(success), Error);
});

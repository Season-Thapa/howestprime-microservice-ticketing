import { assertEquals, assertThrows } from "@std/assert";

import {
  CardNumber,
  ExpiryDate,
  CVV,
  PaymentAmount,
  PaymentMethod,
  PaymentMethodType,
  ExternalId,
  FailureReason,
  PaymentStatus,
} from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("CardNumber - valid and equals", () => {
  const a = CardNumber.create("4111 1111-1111 1111");
  const b = CardNumber.create("4111111111111111");
  assertEquals(a.value, "4111111111111111");
  assertEquals(a.equals(b), true);
});

Deno.test("CardNumber - invalid throws", () => {
  assertThrows(() => CardNumber.create("123"), Error);
});

Deno.test("ExpiryDate - valid and equals", () => {
  const e = ExpiryDate.create("12/28");
  assertEquals(e.value, "12/28");
  assertEquals(e.equals(ExpiryDate.create("12/28")), true);
});

Deno.test("ExpiryDate - invalid throws", () => {
  assertThrows(() => ExpiryDate.create("13/20"), Error);
});

Deno.test("CVV - valid and equals", () => {
  const c = CVV.create("123");
  const d = CVV.create("123");
  assertEquals(c.value, "123");
  assertEquals(c.equals(d), true);
});

Deno.test("CVV - invalid throws", () => {
  assertThrows(() => CVV.create("12a"), Error);
});

Deno.test("PaymentAmount - valid and equals", () => {
  const a = PaymentAmount.create(19.99);
  const b = PaymentAmount.create(19.99);
  assertEquals(a.value, 19.99);
  assertEquals(a.equals(b), true);
});

Deno.test("PaymentAmount - invalid throws", () => {
  assertThrows(() => PaymentAmount.create(0), Error);
  assertThrows(() => PaymentAmount.create(Number.NaN), Error);
});

Deno.test("PaymentMethod - valid and invalid", () => {
  const pm = PaymentMethod.create(PaymentMethodType.CreditCard);
  assertEquals(pm.value, PaymentMethodType.CreditCard);
  assertThrows(() => PaymentMethod.create("Cash" as any), Error);
});

Deno.test("ExternalId - valid and invalid", () => {
  const id = ExternalId.create("ext-123");
  assertEquals(id.value, "ext-123");
  assertThrows(() => ExternalId.create("   "), Error);
});

Deno.test("FailureReason - valid and invalid", () => {
  const r = FailureReason.create("Insufficient funds");
  assertEquals(r.value, "Insufficient funds");
  assertThrows(() => FailureReason.create("  "), Error);
});

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

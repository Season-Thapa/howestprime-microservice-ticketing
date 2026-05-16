import { assertEquals, assertThrows } from "@std/assert";

import { CVV, InvalidCVVException } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("CVV - valid and equals", () => {
  const c = CVV.create("123");
  const d = CVV.create("123");
  assertEquals(c.value, "123");
  assertEquals(c.equals(d), true);
});

Deno.test("CVV - invalid throws", () => {
  assertThrows(() => CVV.create("12a"), InvalidCVVException);
});

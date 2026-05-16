import { assertEquals, assertThrows } from "@std/assert";

import { CardNumber } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("CardNumber - valid and equals", () => {
  const a = CardNumber.create("4111 1111-1111 1111");
  const b = CardNumber.create("4111111111111111");
  assertEquals(a.value, "4111111111111111");
  assertEquals(a.equals(b), true);
});

Deno.test("CardNumber - invalid throws", () => {
  assertThrows(() => CardNumber.create("123"), Error);
});

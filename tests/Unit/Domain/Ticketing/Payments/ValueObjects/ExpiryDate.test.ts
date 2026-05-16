import { assertEquals, assertThrows } from "@std/assert";

import { ExpiryDate } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("ExpiryDate - valid and equals", () => {
  const e = ExpiryDate.create("12/28");
  assertEquals(e.value, "12/28");
  assertEquals(e.equals(ExpiryDate.create("12/28")), true);
});

Deno.test("ExpiryDate - invalid throws", () => {
  assertThrows(() => ExpiryDate.create("13/20"), Error);
});

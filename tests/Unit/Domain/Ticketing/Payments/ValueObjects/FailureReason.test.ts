import { assertEquals, assertThrows } from "@std/assert";

import { FailureReason } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("FailureReason - valid and invalid", () => {
  const r = FailureReason.create("Insufficient funds");
  assertEquals(r.value, "Insufficient funds");
  assertThrows(() => FailureReason.create("  "), Error);
});

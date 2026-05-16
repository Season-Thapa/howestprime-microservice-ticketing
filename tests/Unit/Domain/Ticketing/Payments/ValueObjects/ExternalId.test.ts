import { assertEquals, assertThrows } from "@std/assert";

import { ExternalId } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("ExternalId - valid and invalid", () => {
  const id = ExternalId.create("ext-123");
  assertEquals(id.value, "ext-123");
  assertThrows(() => ExternalId.create("   "), Error);
});

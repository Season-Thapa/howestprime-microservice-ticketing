import { assertEquals, assertThrows } from "@std/assert";

import { ExpiryDate, InvalidExpiryDataException } from "@/Domain/Ticketing/Payments/mod.ts";

Deno.test("ExpiryDate - valid and equals", () => {
  const e = ExpiryDate.create("12/28");
  assertEquals(e.value, "12/28");
  assertEquals(e.equals(ExpiryDate.create("12/28")), true);
  assertEquals(ExpiryDate.create("01/2029").value, "01/2029");
});

Deno.test("ExpiryDate - invalid throws", () => {
  assertThrows(() => ExpiryDate.create("13/20"), InvalidExpiryDataException);
  assertThrows(() => ExpiryDate.create("00/20"), InvalidExpiryDataException);
  assertThrows(() => ExpiryDate.create("1/20"), InvalidExpiryDataException);
  assertThrows(() => ExpiryDate.create("1228"), InvalidExpiryDataException);
});

Deno.test("ExpiryDate - equals returns false for nullish values", () => {
  const expiry = ExpiryDate.create("12/28");

  assertEquals(expiry.equals(null as unknown as ExpiryDate), false);
  assertEquals(expiry.equals(undefined as unknown as ExpiryDate), false);
});

import { assertEquals, assertThrows } from "@std/assert";

import { CustomerFirstName, InvalidCustomerFirstNameException } from "@/Domain/Ticketing/Orders/ValueObjects/CustomerFirstName.ts";

Deno.test("CustomerFirstName - create - valid value returns value object", () => {
  const firstName = CustomerFirstName.create("John");

  assertEquals(firstName.value, "John");
  assertEquals(firstName.toString(), "John");
});

Deno.test("CustomerFirstName - create - empty value throws", () => {
  assertThrows(() => CustomerFirstName.create(""), InvalidCustomerFirstNameException, "CustomerFirstName has invalid value: ''");
});

Deno.test("CustomerFirstName - equals - same value returns true", () => {
  const left = CustomerFirstName.create("John");
  const right = CustomerFirstName.create("John");

  assertEquals(left.equals(right), true);
});

Deno.test("CustomerFirstName - equals - different value returns false", () => {
  const left = CustomerFirstName.create("John");
  const right = CustomerFirstName.create("Jane");

  assertEquals(left.equals(right), false);
});

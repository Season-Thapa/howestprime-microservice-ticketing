import { assertEquals, assertThrows } from "@std/assert";

import { CustomerLastName, InvalidCustomerLastNameException } from "@/Domain/Ticketing/Orders/ValueObjects/CustomerLastName.ts";

Deno.test("CustomerLastName - create - valid value returns value object", () => {
  const lastName = CustomerLastName.create("Doe");

  assertEquals(lastName.value, "Doe");
  assertEquals(lastName.toString(), "Doe");
});

Deno.test("CustomerLastName - create - empty value throws", () => {
  assertThrows(() => CustomerLastName.create(""), InvalidCustomerLastNameException, "CustomerLastName has invalid value: ''");
});

Deno.test("CustomerLastName - equals - same value returns true", () => {
  const left = CustomerLastName.create("Doe");
  const right = CustomerLastName.create("Doe");

  assertEquals(left.equals(right), true);
});

Deno.test("CustomerLastName - equals - different value returns false", () => {
  const left = CustomerLastName.create("Doe");
  const right = CustomerLastName.create("Smith");

  assertEquals(left.equals(right), false);
});

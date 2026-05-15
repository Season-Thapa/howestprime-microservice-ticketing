import { assertEquals, assertThrows } from "@std/assert";

import { Money } from "@/Domain/Shared/mod.ts";
import { InvalidMoneyException } from "@/Domain/Shared/ValueObjects/Money.ts";

Deno.test("Money - create - valid amount returns value object", () => {
  const money = Money.create(15.5);

  assertEquals(money.amount, 15.5);
  assertEquals(money.toString(), "15.5");
});

Deno.test("Money - create - zero amount returns value object", () => {
  const money = Money.create(0);

  assertEquals(money.amount, 0);
});

Deno.test("Money - create - negative amount throws InvalidMoneyException", () => {
  assertThrows(() => Money.create(-1), InvalidMoneyException, "Amount must be greater than or equal to 0");
});

Deno.test("Money - equals - same amount returns true", () => {
  const left = Money.create(12.5);
  const right = Money.create(12.5);

  assertEquals(left.equals(right), true);
});

Deno.test("Money - equals - different amount returns false", () => {
  const left = Money.create(12.5);
  const right = Money.create(13.5);

  assertEquals(left.equals(right), false);
});

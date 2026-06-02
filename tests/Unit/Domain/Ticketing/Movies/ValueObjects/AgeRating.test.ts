import { assertEquals, assertThrows } from "@std/assert";
import { AgeRating, InvalidAgeRatingException } from "@/Domain/Shared/mod.ts";

Deno.test("AgeRating - creates successfully with valid string", () => {
  const rating = AgeRating.create("PG-13");
  assertEquals(rating.value, "PG-13");
});

Deno.test("AgeRating - invalid and equality/toString", () => {
  // invalid empty
  assertThrows(() => AgeRating.create(""), InvalidAgeRatingException);

  const a1 = AgeRating.create('12+');
  const a2 = AgeRating.create('12+');
  const a3 = AgeRating.create('16+');

  assertEquals(a1.equals(a2), true);
  assertEquals(a1.equals(a3), false);
  assertEquals(a1.toString(), '12+');
});

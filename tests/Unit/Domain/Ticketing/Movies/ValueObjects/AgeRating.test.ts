import { assertEquals } from "@std/assert";
import { AgeRating } from "@/Domain/Shared/mod.ts";

Deno.test("AgeRating - creates successfully with valid string", () => {
  const rating = AgeRating.create("PG-13");
  assertEquals(rating.value, "PG-13");
});

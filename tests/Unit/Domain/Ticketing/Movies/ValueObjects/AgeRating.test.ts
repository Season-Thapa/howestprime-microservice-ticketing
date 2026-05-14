import { assertEquals, assertThrows } from '@std/assert';
import { InvalidAgeRatingException, AgeRating } from "@/Domain/Ticketing/Movies/mod.ts";

Deno.test("AgeRating - creates successfully with valid string", () => {
    const rating = AgeRating.create("PG-13");
    assertEquals(rating.value, "PG-13");
});

Deno.test("AgeRating - throws InvalidAgeRatingException when empty after trimming", () => {
    assertThrows(() => AgeRating.create(""), InvalidAgeRatingException);
    assertThrows(() => AgeRating.create("   "), InvalidAgeRatingException);
});
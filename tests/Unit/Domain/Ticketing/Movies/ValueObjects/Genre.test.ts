import { assertEquals, assertThrows } from "@std/assert";
import { Genre, InvalidGenreException } from "@/Domain/Shared/mod.ts";

Deno.test("Genre - creates successfully with valid string", () => {
  const genre = Genre.create("Action");
  assertEquals(genre.value, "Action");
});

Deno.test("Genre - throws InvalidGenreException when empty or whitespace", () => {
  assertThrows(() => Genre.create(""), InvalidGenreException);
  assertThrows(() => Genre.create("   "), InvalidGenreException);
});

import { assertEquals, assertThrows } from "@std/assert";
import { PosterUrl, InvalidPosterUrlException } from "@/Domain/Shared/mod.ts";

Deno.test("PosterUrl - creates successfully with valid URL", () => {
  const urlString = "https://example.com/poster.jpg";
  const poster = PosterUrl.create(urlString);
  assertEquals(poster.value, urlString);
});

Deno.test("PosterUrl - throws InvalidPosterUrlException when URL is invalid format", () => {
  assertThrows(() => PosterUrl.create("not-a-valid-url"), InvalidPosterUrlException);
});

Deno.test("PosterUrl - throws InvalidPosterUrlException when empty", () => {
  assertThrows(() => PosterUrl.create(""), InvalidPosterUrlException);
  assertThrows(() => PosterUrl.create("   "), InvalidPosterUrlException);
});

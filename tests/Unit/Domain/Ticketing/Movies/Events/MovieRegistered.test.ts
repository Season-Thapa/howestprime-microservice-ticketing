import { assertEquals } from "@std/assert";

import { MovieRegistered } from "@/Domain/Ticketing/Movies/mod.ts";

Deno.test("MovieRegistered - exposes payload and fqdn", () => {
  const event = MovieRegistered.create(
    crypto.randomUUID(),
    "The Great Booking",
    2026,
    120,
    ["Drama", "Thriller"],
    ["Actor One", "Actor Two"],
    "12+",
    "https://example.com/poster.jpg",
  );

  assertEquals(event.movieId.length > 0, true);
  assertEquals(event.title, "The Great Booking");
  assertEquals(event.releaseYear, 2026);
  assertEquals(event.duration, 120);
  assertEquals(event.genres.length, 2);
  assertEquals(event.actors.length, 2);
  assertEquals(event.ageRating, "12+");
  assertEquals(event.posterUrl, "https://example.com/poster.jpg");
  assertEquals(event.FQDN.value, "howestprime.ticketing.movies.movieregistered");
  assertEquals(event.occurredOn instanceof Date, true);
});

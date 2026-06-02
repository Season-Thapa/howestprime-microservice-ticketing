import { assertEquals, assertThrows } from "@std/assert";
import { MovieDuration, InvalidMovieDurationException } from "@/Domain/Shared/mod.ts";

Deno.test("MovieDuration - creates successfully under 100 minutes with no intermission", () => {
  const duration = MovieDuration.create(90);
  assertEquals(duration.duration, 90); // Use your actual getter name (e.g., duration or value)
});

Deno.test("MovieDuration - adds 10 minute intermission when over 100 minutes", () => {
  const duration = MovieDuration.create(120);
  assertEquals(duration.duration, 130); // 120 + 10 minute intermission
});

Deno.test("MovieDuration - throws error when duration is 0 or negative", () => {
  assertThrows(
    () => MovieDuration.create(0),
    InvalidMovieDurationException, // Change to your specific DomainException if you use one
  );
  assertThrows(() => MovieDuration.create(-15), InvalidMovieDurationException);
});

Deno.test("MovieDuration - totalDuration matches duration", () => {
  const d1 = MovieDuration.create(90);
  const d2 = MovieDuration.create(90);
  const d3 = MovieDuration.create(120);

  assertEquals(d1.totalDuration, d1.duration);
  assertEquals(d3.totalDuration, d3.duration);

  // equals
  assertEquals(d1.equals(d2), true);
  assertEquals(d1.equals(d3), false);

});

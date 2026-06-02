import { assertEquals } from "@std/assert";

import { MovieId } from "@/Domain/Ticketing/Movies/mod.ts";
import { AgeRating, Genre, MovieDuration, MovieTitle, PosterUrl } from "@/Domain/Shared/mod.ts";
import { Money } from "@/Domain/Shared/mod.ts";
import { MovieInfo } from "@/Domain/Ticketing/Orders/mod.ts";

function createMovieInfo(movieId: string, genres: string[] = ["Drama"]): MovieInfo {
  return MovieInfo.create(
    MovieId.create(movieId),
    crypto.randomUUID(),
    MovieTitle.create("The Great Booking"),
    MovieDuration.create(120),
    genres.map((genre) => Genre.create(genre)),
    PosterUrl.create("https://example.com/poster.jpg"),
    AgeRating.create("12+"),
    Money.create(15),
  );
}

Deno.test("MovieInfo - exposes all values", () => {
  const movieId = crypto.randomUUID();
  const movieInfo = createMovieInfo(movieId);

  assertEquals(movieInfo.id.value, movieId);
  assertEquals(movieInfo.title.value, "The Great Booking");
  assertEquals(movieInfo.duration.duration, 130);
  assertEquals(movieInfo.genres.length, 1);
  assertEquals(movieInfo.posterUrl.value, "https://example.com/poster.jpg");
  assertEquals(movieInfo.ageRating.value, "12+");
  assertEquals(movieInfo.price.amount, 15);
});

Deno.test("MovieInfo - equals - same values returns true", () => {
  const movieId = crypto.randomUUID();
  const left = createMovieInfo(movieId);
  const right = createMovieInfo(movieId);

  assertEquals(left.equals(right), true);
});

Deno.test("MovieInfo - equals - different values returns false", () => {
  const left = createMovieInfo(crypto.randomUUID(), ["Drama"]);
  const right = createMovieInfo(crypto.randomUUID(), ["Thriller"]);

  assertEquals(left.equals(right), false);
});

Deno.test("MovieInfo - equals - non instance returns false", () => {
  const movieInfo = createMovieInfo(crypto.randomUUID());

  assertEquals(movieInfo.equals({} as unknown as MovieInfo), false);
});

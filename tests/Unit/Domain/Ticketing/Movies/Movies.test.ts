import { assertEquals, assertThrows } from "@std/assert";
import { Movie, MovieTitle } from "@/Domain/Ticketing/Movies/mod.ts";
import { MovieDuration, Genre, PosterUrl, AgeRating, InvalidGenreException } from "@/Domain/Shared/mod.ts";

Deno.test("Movie - calculates exact price and creates successfully", () => {
  // Arrange

  const externalId = crypto.randomUUID();
  const title = MovieTitle.create("Inception");
  const duration = MovieDuration.create(100);
  const genres = [Genre.create("Sci-Fi")];
  const posterUrl = PosterUrl.create("https://example.com/poster.jpg");
  const ageRating = AgeRating.create("12A");
  // Act
  const movie = Movie.create(externalId, title, ageRating, genres, duration, posterUrl);

  // Assert
  assertEquals(movie.externalId, externalId);
  assertEquals(movie.title.value, "Inception");
  assertEquals(movie.price.amount, 15.0);
});

Deno.test("Movie - throws InvalidGenreException if genres array is empty", () => {
  // Arrange
  const externalId = crypto.randomUUID();
  const title = MovieTitle.create("Inception");
  const duration = MovieDuration.create(100);
  const genres: Genre[] = [];
  const posterUrl = PosterUrl.create("https://example.com/poster.jpg");
  const ageRating = AgeRating.create("12A");
  // Act & Assert
  assertThrows(() => Movie.create(externalId, title, ageRating, genres, duration, posterUrl), InvalidGenreException);
});

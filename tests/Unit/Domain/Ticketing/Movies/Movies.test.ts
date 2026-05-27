import { assertEquals, assertThrows } from "@std/assert";
import { Movie, MovieId, MovieTitle, MovieDuration, Genre, PosterUrl, AgeRating, InvalidGenreException } from "@/Domain/Ticketing/Movies/mod.ts";

Deno.test("Movie - calculates exact price and creates successfully", () => {
  // Arrange

  const id = crypto.randomUUID();
  const title = MovieTitle.create("Inception");
  const duration = MovieDuration.create(100);
  const genres = [Genre.create("Sci-Fi")];
  const posterUrl = PosterUrl.create("https://example.com/poster.jpg");
  const ageRating = AgeRating.create("12A");
  // Act
  const movie = Movie.create(id, title, ageRating, genres, duration, posterUrl);

  // Assert
  assertEquals(movie.id.value, id);
  assertEquals(movie.title.value, "Inception");
  assertEquals(movie.price.amount, 15.0);
});

Deno.test("Movie - throws InvalidGenreException if genres array is empty", () => {
  // Arrange
  const id = crypto.randomUUID();
  const title = MovieTitle.create("Inception");
  const duration = MovieDuration.create(100);
  const genres: Genre[] = [];
  const posterUrl = PosterUrl.create("https://example.com/poster.jpg");
  const ageRating = AgeRating.create("12A");
  // Act & Assert
  assertThrows(() => Movie.create(id, title, ageRating, genres, duration, posterUrl), InvalidGenreException);
});

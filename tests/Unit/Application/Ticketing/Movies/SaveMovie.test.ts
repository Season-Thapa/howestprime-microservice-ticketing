import { assertEquals, assertRejects } from "@std/assert";
import { SaveMovie } from "@/Application/Ticketing/Movies/SaveMovie.ts";
import { createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import { SaveMovieInput } from "@/Application/Ticketing/Movies/mod.ts";
import type { Logger } from "@/Application/Ports/mod.ts";
const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
Deno.test("SaveMovie - successfully creates and saves a movie", async () => {
  // Arrange
  const mockUow = createMockUnitOfWork();
  const useCase = new SaveMovie(mockUow, mockLogger);
  const externalId = "0000-0000-0000-0000-000000000001";

  const validInput: SaveMovieInput = {
    externalId: externalId,
    title: "Inception",
    duration: 148,
    ageRating: "PG-13",
    genres: ["Sci-Fi", "Action"],
    posterUrl: "https://example.com/inception.jpg",
  };

  // Act

  const result = await useCase.execute(validInput);

  // Assert
  assertEquals(result.length > 0, true);
  assertEquals(mockUow.doCalled, true);
  assertEquals(mockUow.getRepositoryCalled, false);
  assertEquals(mockUow.saveCalled, true);
  assertEquals(mockUow.saveCallCount, 1);
});
Deno.test("SaveMovie - throws error when validation fails", async () => {
  // Arrange
  const mockUow = createMockUnitOfWork();
  const useCase = new SaveMovie(mockUow, mockLogger);
  const externalId = "0000-0000-0000-0000-000000000001";

  const invalidInput: SaveMovieInput = {
    externalId: externalId,
    title: "Inception",
    duration: 148,
    ageRating: "PG-13",
    genres: [],
    posterUrl: "https://example.com/inception.jpg",
  };

  // Act & Assert
  await assertRejects(async () => {
    await useCase.execute(invalidInput);
  });
});

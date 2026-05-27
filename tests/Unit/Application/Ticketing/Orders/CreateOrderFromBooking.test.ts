import { assertEquals, assertRejects } from "@std/assert";
import { CreateOrderFromBooking, type CreateOrderFromBookingUseCaseInput } from "@/Application/Ticketing/Orders/CreateOrderFromBooking.ts";
import { createMockUnitOfWork } from "@/tests/Unit/Application/Shared/mod.ts";
import type { Logger } from "@/Application/Ports/mod.ts";
import { MovieDuration, Genre, PosterUrl, AgeRating } from "@/Domain/Shared/mod.ts";
import { Movie, MovieId, MovieTitle } from "@/Domain/Ticketing/Movies/mod.ts";
import { Order } from "@/Domain/Ticketing/Orders/mod.ts";
import { Optional } from "@domaincrafters/std";

const mockLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

// Helper to create a valid test movie
function createTestMovie(movieId: string): Movie {
  const externalId = "0000-0000-0000-0000-000000000001";

  return Movie.create(
    MovieId.create(movieId),
    externalId,
    MovieTitle.create("Test Movie"),
    AgeRating.create("12+"),
    [Genre.create("Drama")],
    MovieDuration.create(120),
    PosterUrl.create("https://example.com/poster.jpg"),
  );
}

Deno.test("CreateOrderFromBooking - successfully creates order with standard and discounted visitors", async () => {
  // Arrange
  const bookingId = crypto.randomUUID();
  const externalId = "0000-0000-0000-0000-000000000001";

  const testMovie = createTestMovie(externalId);

  const mockMovieRepository = {
    findById: async (id: string) => {
      if (id === externalId) {
        return Optional.of(testMovie);
      }
      return Optional.empty();
    },
    save: async () => {},
    remove: async () => {},
  };

  const mockUow = createMockUnitOfWork({
    repositories: new Map([
      ["Movie", mockMovieRepository as any],
      [
        "Order",
        {
          save: async () => {},
          remove: async () => {},
          findById: async () => Optional.empty(),
        } as any,
      ],
    ]),
  });

  const useCase = new CreateOrderFromBooking(mockUow, mockLogger);

  const input: CreateOrderFromBookingUseCaseInput = {
    bookingId,
    externalId: movieId,
    room: "Room A",
    showtime: "2026-05-15T18:30:00.000Z",
    standardVisitors: 2,
    discountedVisitors: 1,
    seatNumbers: [12, 13, 14],
  };

  // Act
  const result = await useCase.execute(input);

  // Assert
  assertEquals(result.length > 0, true);
  assertEquals(mockUow.saveCalled, true);
  function createTestMovie(movieId: string): Movie {
    return Movie.create(
      movieId,
      MovieTitle.create("Test Movie"),
      AgeRating.create("12+"),
      [Genre.create("Drama")],
      MovieDuration.create(120),
      PosterUrl.create("https://example.com/poster.jpg"),
    );
  }

  const mockUow = createMockUnitOfWork({
    repositories: new Map([["Movie", mockMovieRepository as any]]),
  });

  const useCase = new CreateOrderFromBooking(mockUow, mockLogger);

  const input: CreateOrderFromBookingUseCaseInput = {
    bookingId,
    externalId: movieId,
    room: "Room A",
    showtime: "2026-05-15T18:30:00.000Z",
    standardVisitors: 1,
    discountedVisitors: 0,
    seatNumbers: [12],
  };

  // Act & Assert
  await assertRejects(async () => await useCase.execute(input), Error, `Movie with ID ${movieId} not found`);
});

Deno.test("CreateOrderFromBooking - throws error when seat count does not match visitor count", async () => {
  // Arrange
  const movieId = crypto.randomUUID();
  const bookingId = crypto.randomUUID();
  const testMovie = createTestMovie(movieId);

  const mockMovieRepository = {
    findById: async () => Optional.of(testMovie),
    save: async () => {},
    remove: async () => {},
  };

  const mockUow = createMockUnitOfWork({
    repositories: new Map([["Movie", mockMovieRepository as any]]),
  });

  const useCase = new CreateOrderFromBooking(mockUow, mockLogger);

  const input: CreateOrderFromBookingUseCaseInput = {
    bookingId,
    externalId: movieId,
    room: "Room A",
    showtime: "2026-05-15T18:30:00.000Z",
    standardVisitors: 2,
    discountedVisitors: 1,
    seatNumbers: [12, 13], // Only 2 seats but 3 visitors
  };

  // Act & Assert
  await assertRejects(async () => await useCase.execute(input), Error, "Mismatch: Provided 2 seats for 3 visitors");
});

Deno.test("CreateOrderFromBooking - creates correct ticket distribution for standard visitors", async () => {
  // Arrange
  const movieId = crypto.randomUUID();
  const bookingId = crypto.randomUUID();
  const testMovie = createTestMovie(movieId);
  let savedOrder: Order | undefined;

  const mockMovieRepository = {
    findById: async () => Optional.of(testMovie),
    save: async () => {},
    remove: async () => {},
  };

  const mockOrderRepository = {
    save: async (order: Order) => {
      savedOrder = order;
    },
    remove: async () => {},
    findById: async () => Optional.empty(),
  };

  const mockUow = createMockUnitOfWork({
    repositories: new Map([
      ["Movie", mockMovieRepository as any],
      ["Order", mockOrderRepository as any],
    ]),
  });

  const useCase = new CreateOrderFromBooking(mockUow, mockLogger);

  const input: CreateOrderFromBookingUseCaseInput = {
    bookingId,
    externalId: movieId,
    room: "Room A",
    showtime: "2026-05-15T18:30:00.000Z",
    standardVisitors: 2,
    discountedVisitors: 1,
    seatNumbers: [12, 13, 14],
  };

  // Act
  await useCase.execute(input);

  // Assert
  const order = savedOrder;
  if (!order) {
    throw new Error("Expected order to be saved");
  }

  assertEquals(order.tickets.length, 3);
  assertEquals(order.tickets[0]?.seat.visitorType, "standard");
  assertEquals(order.tickets[1]?.seat.visitorType, "standard");
  assertEquals(order.tickets[2]?.seat.visitorType, "discounted");
});

Deno.test("CreateOrderFromBooking - correctly calculates total price", async () => {
  // Arrange
  const movieId = crypto.randomUUID();
  const bookingId = crypto.randomUUID();
  const testMovie = createTestMovie(movieId);
  let savedOrder: Order | undefined;

  const mockMovieRepository = {
    findById: async () => Optional.of(testMovie),
    save: async () => {},
    remove: async () => {},
  };

  const mockOrderRepository = {
    save: async (order: Order) => {
      savedOrder = order;
    },
    remove: async () => {},
    findById: async () => Optional.empty(),
  };

  const mockUow = createMockUnitOfWork({
    repositories: new Map([
      ["Movie", mockMovieRepository as any],
      ["Order", mockOrderRepository as any],
    ]),
  });

  const useCase = new CreateOrderFromBooking(mockUow, mockLogger);

  const input: CreateOrderFromBookingUseCaseInput = {
    bookingId,
    movieId,
    room: "Room A",
    showtime: "2026-05-15T18:30:00.000Z",
    standardVisitors: 2,
    discountedVisitors: 1,
    seatNumbers: [12, 13, 14],
  };

  // Act
  await useCase.execute(input);

  // Assert
  const order = savedOrder;
  if (!order) {
    throw new Error("Expected order to be saved");
  }

  assertEquals(order.tickets.length, 3);
  assertEquals(order.price.amount > 0, true);
});

import { assertEquals, assertThrows } from "@std/assert";
import { Order, BookingId, MovieInfo } from "@/Domain/Ticketing/Orders/mod.ts";
import { Ticket } from "@/Domain/Ticketing/Orders/Entities/Ticket.ts";
import { Seat, VisitorType } from "@/Domain/Ticketing/Orders/ValueObjects/Seat.ts";
import { MovieId, MovieTitle, AgeRating, Genre, MovieDuration, PosterUrl } from "@/Domain/Ticketing/Movies/mod.ts";
import { Money } from "@/Domain/Shared/ValueObjects/Money.ts";

// Helper function to create valid movie info
function createValidMovieInfo(): MovieInfo {
  return MovieInfo.create(
    MovieId.create(crypto.randomUUID()),
    MovieTitle.create("Test Movie"),
    MovieDuration.create(120),
    [Genre.create("Drama")],
    PosterUrl.create("https://example.com/poster.jpg"),
    AgeRating.create("12+"),
    Money.create(15.0),
  );
}

Deno.test("Order - creates successfully with valid tickets", () => {
  // Arrange
  const bookingId = BookingId.create(crypto.randomUUID());
  const movieInfo = createValidMovieInfo();
  const seat1 = Seat.create(1, VisitorType.Standard);
  const seat2 = Seat.create(2, VisitorType.Discounted);
  const ticket1 = Ticket.create(movieInfo, seat1, "Room A", new Date("2026-05-15T18:30:00Z"));
  const ticket2 = Ticket.create(movieInfo, seat2, "Room A", new Date("2026-05-15T18:30:00Z"));
  const tickets = [ticket1, ticket2];

  // Act
  const order = Order.create(bookingId, tickets);

  // Assert
  assertEquals(order.bookingId.value, bookingId.value);
  assertEquals(order.tickets.length, 2);
  assertEquals(order.status.value, "Open");
});

Deno.test("Order - throws error when created with empty tickets array", () => {
  // Arrange
  const bookingId = BookingId.create(crypto.randomUUID());
  const tickets: Ticket[] = [];

  // Act & Assert
  assertThrows(() => Order.create(bookingId, tickets), Error, "An order must contain at least one ticket.");
});

Deno.test("Order - calculates correct total price for standard tickets", () => {
  // Arrange
  const bookingId = BookingId.create(crypto.randomUUID());
  const movieInfo = createValidMovieInfo();
  const seat1 = Seat.create(1, VisitorType.Standard);
  const seat2 = Seat.create(2, VisitorType.Standard);
  const ticket1 = Ticket.create(movieInfo, seat1, "Room A", new Date("2026-05-15T18:30:00Z"));
  const ticket2 = Ticket.create(movieInfo, seat2, "Room A", new Date("2026-05-15T18:30:00Z"));
  const tickets = [ticket1, ticket2];

  // Act
  const order = Order.create(bookingId, tickets);

  // Assert
  // 2 standard tickets at 15.0 each = 30.0
  assertEquals(order.price.amount, 30.0);
});

Deno.test("Order - calculates correct total price for mixed visitor types", () => {
  // Arrange
  const bookingId = BookingId.create(crypto.randomUUID());
  const movieInfo = createValidMovieInfo();
  const seat1 = Seat.create(1, VisitorType.Standard);
  const seat2 = Seat.create(2, VisitorType.Discounted);
  const seat3 = Seat.create(3, VisitorType.Standard);
  const ticket1 = Ticket.create(movieInfo, seat1, "Room A", new Date("2026-05-15T18:30:00Z"));
  const ticket2 = Ticket.create(movieInfo, seat2, "Room A", new Date("2026-05-15T18:30:00Z"));
  const ticket3 = Ticket.create(movieInfo, seat3, "Room A", new Date("2026-05-15T18:30:00Z"));
  const tickets = [ticket1, ticket2, ticket3];

  // Act
  const order = Order.create(bookingId, tickets);

  // Assert
  // 2 standard (15.0 each) + 1 discounted (10% discount = 15.0 * 0.9 = 13.5) = 43.5
  assertEquals(order.price.amount, 43.5);
});

Deno.test("Order - generates UUID for id when created", () => {
  // Arrange
  const bookingId = BookingId.create(crypto.randomUUID());
  const movieInfo = createValidMovieInfo();
  const seat = Seat.create(1, VisitorType.Standard);
  const ticket = Ticket.create(movieInfo, seat, "Room A", new Date("2026-05-15T18:30:00Z"));

  // Act
  const order1 = Order.create(bookingId, [ticket]);
  const order2 = Order.create(bookingId, [ticket]);

  // Assert
  assertEquals(order1.id.value !== order2.id.value, true);
});

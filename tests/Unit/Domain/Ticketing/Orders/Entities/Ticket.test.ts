import { assertEquals, assertThrows } from "@std/assert";

import { MovieId } from "@/Domain/Ticketing/Movies/mod.ts";
import { AgeRating, Genre, MovieDuration, MovieTitle, PosterUrl } from "@/Domain/Shared/mod.ts";
import { Money } from "@/Domain/Shared/mod.ts";
import { MovieInfo, Seat, VisitorType } from "@/Domain/Ticketing/Orders/mod.ts";
import { Ticket } from "@/Domain/Ticketing/Orders/Entities/Ticket.ts";

function createMovieInfo(): MovieInfo {
  return MovieInfo.create(
    MovieId.create(crypto.randomUUID()),
    crypto.randomUUID(),
    MovieTitle.create("The Great Booking"),
    MovieDuration.create(120),
    [Genre.create("Drama")],
    PosterUrl.create("https://example.com/poster.jpg"),
    AgeRating.create("12+"),
    Money.create(15),
  );
}

Deno.test("Ticket - exposes all values", () => {
  const movieInfo = createMovieInfo();
  const seat = Seat.create(12, VisitorType.Standard);
  const showtime = new Date("2026-05-15T18:30:00.000Z");
  const ticket = Ticket.create(movieInfo, seat, "Room A", showtime);

  assertEquals(ticket.movieInfo.equals(movieInfo), true);
  assertEquals(ticket.seat.equals(seat), true);
  assertEquals(ticket.room, "Room A");
  assertEquals(ticket.price.amount, 15);
  assertEquals(ticket.showtime.toISOString(), showtime.toISOString());
});

Deno.test("Ticket - discounted visitor receives discounted price", () => {
  const movieInfo = createMovieInfo();
  const seat = Seat.create(13, VisitorType.Discounted);
  const ticket = Ticket.create(movieInfo, seat, "Room A", new Date("2026-05-15T18:30:00.000Z"));

  assertEquals(ticket.price.amount, 13.5);
});

Deno.test("Ticket - empty room throws", () => {
  const movieInfo = createMovieInfo();
  const seat = Seat.create(12, VisitorType.Standard);

  assertThrows(() => Ticket.create(movieInfo, seat, "   ", new Date("2026-05-15T18:30:00.000Z")), Error, "Room cannot be empty.");
});

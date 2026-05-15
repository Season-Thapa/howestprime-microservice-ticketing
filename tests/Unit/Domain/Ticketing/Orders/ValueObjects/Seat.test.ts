import { assertEquals, assertThrows } from "@std/assert";
import { Seat, VisitorType } from "@/Domain/Ticketing/Orders/ValueObjects/Seat.ts";

Deno.test("Seat - creates successfully with valid seat number and visitor type", () => {
  // Arrange & Act
  const seat = Seat.create(1, VisitorType.Standard);

  // Assert
  assertEquals(seat.seatNumber, 1);
  assertEquals(seat.visitorType, VisitorType.Standard);
});

Deno.test("Seat - creates with discounted visitor type", () => {
  // Arrange & Act
  const seat = Seat.create(42, VisitorType.Discounted);

  // Assert
  assertEquals(seat.seatNumber, 42);
  assertEquals(seat.visitorType, VisitorType.Discounted);
});

Deno.test("Seat - throws error when seat number is zero", () => {
  // Act & Assert
  assertThrows(() => Seat.create(0, VisitorType.Standard), Error, "Seat number must be a valid positive integer.");
});

Deno.test("Seat - throws error when seat number is negative", () => {
  // Act & Assert
  assertThrows(() => Seat.create(-5, VisitorType.Standard), Error, "Seat number must be a valid positive integer.");
});

Deno.test("Seat - treats equal seats as equal value objects", () => {
  // Arrange
  const seat1 = Seat.create(5, VisitorType.Standard);
  const seat2 = Seat.create(5, VisitorType.Standard);

  // Act & Assert
  assertEquals(seat1.equals(seat2), true);
});

Deno.test("Seat - treats different seats as different value objects", () => {
  // Arrange
  const seat1 = Seat.create(5, VisitorType.Standard);
  const seat2 = Seat.create(6, VisitorType.Standard);

  // Act & Assert
  assertEquals(seat1.equals(seat2), false);
});

Deno.test("Seat - treats seats with different visitor types as different", () => {
  // Arrange
  const seat1 = Seat.create(5, VisitorType.Standard);
  const seat2 = Seat.create(5, VisitorType.Discounted);

  // Act & Assert
  assertEquals(seat1.equals(seat2), false);
});

Deno.test("VisitorType - has Standard option", () => {
  assertEquals(VisitorType.Standard, "standard");
});

Deno.test("VisitorType - has Discounted option", () => {
  assertEquals(VisitorType.Discounted, "discounted");
});

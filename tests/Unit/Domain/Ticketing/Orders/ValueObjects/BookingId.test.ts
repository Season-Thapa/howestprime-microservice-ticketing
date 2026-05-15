import { assertEquals, assertThrows } from "@std/assert";
import { BookingId } from "@/Domain/Ticketing/Orders/ValueObjects/BookingId.ts";

Deno.test("BookingId - creates successfully with valid UUID", () => {
  // Arrange
  const validUUID = crypto.randomUUID();

  // Act
  const bookingId = BookingId.create(validUUID);

  // Assert
  assertEquals(bookingId.value, validUUID);
});

Deno.test("BookingId - throws error with invalid UUID format", () => {
  // Act & Assert
  assertThrows(() => BookingId.create("not-a-uuid"), Error, "Invalid UUID");
});

Deno.test("BookingId - treats equal UUIDs as equal entity IDs", () => {
  // Arrange
  const uuid = crypto.randomUUID();
  const bookingId1 = BookingId.create(uuid);
  const bookingId2 = BookingId.create(uuid);

  // Act & Assert
  assertEquals(bookingId1.equals(bookingId2), true);
});

Deno.test("BookingId - treats different UUIDs as different entity IDs", () => {
  // Arrange
  const bookingId1 = BookingId.create(crypto.randomUUID());
  const bookingId2 = BookingId.create(crypto.randomUUID());

  // Act & Assert
  assertEquals(bookingId1.equals(bookingId2), false);
});

Deno.test("BookingId - returns string representation", () => {
  // Arrange
  const uuid = crypto.randomUUID();
  const bookingId = BookingId.create(uuid);

  // Act
  const stringValue = bookingId.toString();

  // Assert
  assertEquals(stringValue, uuid);
});

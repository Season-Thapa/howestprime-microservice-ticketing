import { assertEquals } from "@std/assert";
import { OrderStatus, OrderStatusState } from "@/Domain/Ticketing/Orders/ValueObjects/OrderStatus.ts";

Deno.test("OrderStatus - creates successfully with 'Open' status", () => {
  // Act
  const status = OrderStatus.create(OrderStatusState.Open);

  // Assert
  assertEquals(status.value, OrderStatusState.Open);
});

Deno.test("OrderStatus - creates successfully with 'Paid' status", () => {
  // Act
  const status = OrderStatus.create(OrderStatusState.Paid);

  // Assert
  assertEquals(status.value, OrderStatusState.Paid);
});

Deno.test("OrderStatus - creates successfully with 'TicketReleased' status", () => {
  // Act
  const status = OrderStatus.create(OrderStatusState.TicketReleased);

  // Assert
  assertEquals(status.value, OrderStatusState.TicketReleased);
});

Deno.test("OrderStatus - creates successfully with 'Canceled' status", () => {
  // Act
  const status = OrderStatus.create(OrderStatusState.Canceled);

  // Assert
  assertEquals(status.value, OrderStatusState.Canceled);
});

Deno.test("OrderStatus - treats equal statuses as equal value objects", () => {
  // Arrange
  const status1 = OrderStatus.create(OrderStatusState.Open);
  const status2 = OrderStatus.create(OrderStatusState.Open);

  // Act & Assert
  assertEquals(status1.equals(status2), true);
});

Deno.test("OrderStatus - treats different statuses as different value objects", () => {
  // Arrange
  const status1 = OrderStatus.create(OrderStatusState.Open);
  const status2 = OrderStatus.create(OrderStatusState.Paid);

  // Act & Assert
  assertEquals(status1.equals(status2), false);
});

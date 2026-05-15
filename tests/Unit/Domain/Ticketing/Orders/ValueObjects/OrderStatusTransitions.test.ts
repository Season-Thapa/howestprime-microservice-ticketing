import { assertEquals, assertThrows } from "@std/assert";

import { InvalidOrderStatusTransitionException, OrderStatus, OrderStatusState } from "@/Domain/Ticketing/Orders/ValueObjects/OrderStatus.ts";

Deno.test("OrderStatus - acceptTerms returns true only for open", () => {
  assertEquals(OrderStatus.create(OrderStatusState.Open).acceptTerms(), true);
  assertEquals(OrderStatus.create(OrderStatusState.Paid).acceptTerms(), false);
});

Deno.test("OrderStatus - transitionTo - open to paid returns paid", () => {
  const result = OrderStatus.create(OrderStatusState.Open).transitionTo(OrderStatus.Paid);

  assertEquals(result.value, OrderStatusState.Paid);
});

Deno.test("OrderStatus - transitionTo - open to canceled returns canceled", () => {
  const result = OrderStatus.create(OrderStatusState.Open).transitionTo(OrderStatus.Canceled);

  assertEquals(result.value, OrderStatusState.Canceled);
});

Deno.test("OrderStatus - transitionTo - paid to ticket released returns ticket released", () => {
  const result = OrderStatus.create(OrderStatusState.Paid).transitionTo(OrderStatus.TicketReleased);

  assertEquals(result.value, OrderStatusState.TicketReleased);
});

Deno.test("OrderStatus - transitionTo - same status throws", () => {
  assertThrows(
    () => OrderStatus.create(OrderStatusState.Open).transitionTo(OrderStatus.Open),
    InvalidOrderStatusTransitionException,
    "The order is already in this status.",
  );
});

Deno.test("OrderStatus - transitionTo - invalid transition throws", () => {
  assertThrows(
    () => OrderStatus.create(OrderStatusState.Paid).transitionTo(OrderStatus.Canceled),
    InvalidOrderStatusTransitionException,
    "This transition violates order  rules.",
  );
});

Deno.test("OrderStatus - equals - null returns false", () => {
  const status = OrderStatus.create(OrderStatusState.Open);

  assertEquals(status.equals(null as unknown as OrderStatus), false);
});

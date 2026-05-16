# Application Policies

This document lists application-layer policies: event-driven, internal handlers that react to domain events and orchestrate follow-up use cases. Policies are registered via the `domainEventPolicies` mapping and executed by the `PolicyDomainEventListener` with a fresh DI scope.

---

## FR06 — WhenPaymentSucceededThenMarkOrderAsPaid

- **Trigger (internal event):** `PaymentSuccess` domain event
  - FQDN: `howestprime.ticketing.payment.paymentsuccess`
  - Emitted by: `Payment` aggregate when a payment is marked as successful
- **Policy class:** `WhenPaymentSucceededThenMarkOrderAsPaid`
  - Location: `src/Application/Ticketing/Payments/WhenPaymentSucceededThenMarkOrderAsPaid.ts`
  - Behavior: resolves the `MarkOrderAsPaid` use case and calls it with `{ orderId: <event.orderId> }`
- **Use case executed:** `MarkOrderAsPaid`
  - Location: `src/Application/Ticketing/Orders/MarkOrderAsPaid.ts`
  - Input: `{ orderId: string }`
  - Action: loads the `Order` aggregate, calls `order.markAsPaid()`, persists the order, and emits internal `OrderPaid` event
- **Policy registration:**
  - Mapping: `src/Application/Policies.ts` — maps `PaymentSuccess.FQDN` → `[WhenPaymentSucceededThenMarkOrderAsPaid.name]`
  - DI registration: policies and the `MarkOrderAsPaid` use case are registered in the application module: `src/Main/Modules/Application/Module.ts` (scoped services)
- **Pre-conditions:**
  1. `PaymentSuccess` event is received
  2. Related order exists
  3. Order is still open and terms were accepted
- **Post-conditions:**
  1. Order status becomes `Paid`
  2. Internal `OrderPaid` event is emitted

### How it runs at runtime

1. `Payment` aggregate raises `PaymentSuccess` and the UnitOfWork / domain event pipeline publishes it.
2. `PolicyDomainEventListener` receives the event, looks up registered policies, creates a fresh DI scope, resolves `WhenPaymentSucceededThenMarkOrderAsPaid` and executes it.
3. The policy resolves `MarkOrderAsPaid` from the same scope, which uses a fresh `UnitOfWork` to load, update and persist the `Order` aggregate.

### How to test

- Unit tests:
  - Test `WhenPaymentSucceededThenMarkOrderAsPaid` by providing a mock `MarkOrderAsPaid` use case and asserting it receives correct input when `handle()` is called.
  - Test `MarkOrderAsPaid` by mocking the `UnitOfWork` and `Order` repository to verify `order.markAsPaid()` is called and the order is saved.
- Integration / manual test (happy path):
  1. Start MongoDB + LavinMQ and the service.
  2. Create an `Order` (POST `/api/orders/from-booking`).
  3. Add customer (POST `/api/orders/{orderId}/customer`) and accept terms.
  4. Pay the order (POST `/api/orders/{orderId}/payments`) with a gateway response that returns success.
  5. Verify order status via GET `/api/orders/{bookingId}` — should be `Paid`.
  6. (Optional) Bind a queue in LavinMQ to `howestprime.ticketing.order.order-paid` and verify the `OrderPaid` message is published.

### Notes / Troubleshooting

- If the order remains `Open` after payment:
  - Ensure the running service was restarted after DI registrations were added (see `src/Main/Modules/Application/Module.ts`).
  - Check logs for `Received PaymentSuccess event for order ...` and `Order marked as paid ...` messages.
  - Confirm `PolicyDomainEventListener` is subscribing handlers (look for registration logs) and that `domainEventPolicies` contains the mapping.

---

## FR07 — WhenOrderPaidThenReleaseTickets

- **Trigger (internal event):** `OrderPaid` domain event
  - FQDN: `howestprime.ticketing.order.order-paid`
  - Emitted by: `Order` aggregate when payment succeeds and the order becomes paid
- **Policy class:** `WhenOrderPaidThenReleaseTickets`
  - Location: `src/Application/Ticketing/Orders/WhenOrderPaidThenReleaseTickets.ts`
  - Behavior: resolves the `ReleaseTicket` use case and calls it with `{ orderId: <event.orderId> }`
- **Use case executed:** `ReleaseTickets`
  - Location: `src/Application/Ticketing/Orders/ReleaseTicket.ts`
  - Input: `{ orderId: string }`
  - Action: loads the `Order` aggregate, calls `order.releaseTickets()`, persists the order, and emits the release event with ticket/customer data
- **Policy registration:**
  - Mapping: `src/Application/Policies.ts` — maps `OrderPaid.FQDN` → `[WhenOrderPaidThenReleaseTickets.name]`
  - DI registration: policy and use case are registered in the application module: `src/Main/Modules/Application/Module.ts` (scoped services)
- **Pre-conditions:**
  1. `OrderPaid` event is received
  2. Related order exists
  3. Order status is `Paid`
- **Post-conditions:**
  1. Order status becomes `TicketReleased`
  2. Release event is published with ticket and optional customer information

### How it runs at runtime

1. `Order` raises `OrderPaid` after the payment policy marks it as paid.
2. `PolicyDomainEventListener` resolves `WhenOrderPaidThenReleaseTickets` and executes it.
3. The policy resolves `ReleaseTicket`, which loads the `Order`, calls `releaseTickets()`, persists the aggregate, and publishes the release event.

### How to test

- Unit tests:
  - Test `WhenOrderPaidThenReleaseTickets` by providing a mock `ReleaseTicket` use case and asserting it receives the correct order id.
  - Test `ReleaseTicket` by mocking the `UnitOfWork` and `Order` repository to verify `order.releaseTickets()` is called and the order is saved.
- Integration / manual test (happy path):
  1. Start MongoDB + LavinMQ and the service.
  2. Create an `Order` (POST `/api/orders/from-booking`).
  3. Add customer (POST `/api/orders/{orderId}/customer`) and accept terms.
  4. Pay the order (POST `/api/orders/{orderId}/payments`) with a successful gateway response.
  5. Verify order status via GET `/api/orders/{bookingId}` — should be `TicketReleased`.
  6. (Optional) Bind a queue in LavinMQ to `howestprime.ticketing.order.ticketreleased` and verify the release message is published.

---

Document created to satisfy FR06 policy documentation requirement.

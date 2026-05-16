import { assertEquals, assertThrows } from "@std/assert";

import {
  CardNumber,
  CVV,
  ExternalId,
  FailureReason,
  Payment,
  PaymentAmount,
  PaymentMethod,
  PaymentMethodType,
  PaymentStatusState,
} from "@/Domain/Ticketing/Payments/mod.ts";
import { ExpiryDate } from "@/Domain/Ticketing/Payments/mod.ts";
import { BookingId, OrderId } from "@/Domain/Ticketing/Orders/mod.ts";
import { PaymentFailed, PaymentSuccess } from "@/Domain/Ticketing/Payments/mod.ts";

function createPayment(): Payment {
  return Payment.create(
    PaymentMethod.create(PaymentMethodType.CreditCard),
    CardNumber.create("4111111111111111"),
    ExpiryDate.create("12/28"),
    CVV.create("123"),
    OrderId.create(crypto.randomUUID()),
    BookingId.create(crypto.randomUUID()),
    PaymentAmount.create(19.99),
    ExternalId.create("ext-123"),
  );
}

Deno.test("Payment - create - starts pending with provided values", () => {
  const payment = createPayment();

  assertEquals(payment.status.value, PaymentStatusState.Pending);
  assertEquals(payment.paymentMethod.value, PaymentMethodType.CreditCard);
  assertEquals(payment.cardNumber.value, "4111111111111111");
  assertEquals(payment.expiryDate.value, "12/28");
  assertEquals(payment.cvv.value, "123");
  assertEquals(payment.amount.value, 19.99);
  assertEquals(payment.externalId.value, "ext-123");
});

Deno.test("Payment - markAsSuccess - updates status and raises event", () => {
  const payment = createPayment();
  const externalId = ExternalId.create("ext-456");

  payment.markAsSuccess(externalId);

  assertEquals(payment.status.value, PaymentStatusState.Success);
  assertEquals(payment.externalId.value, "ext-456");

  const events = payment.pullDomainEvents();
  assertEquals(events.length, 1);
  assertEquals(events[0] instanceof PaymentSuccess, true);
});

Deno.test("Payment - markAsFailed - updates status and raises event", () => {
  const payment = createPayment();
  const reason = FailureReason.create("Payment declined by provider");

  payment.markAsFailed(reason);

  assertEquals(payment.status.value, PaymentStatusState.Failed);

  const events = payment.pullDomainEvents();
  assertEquals(events.length, 1);
  assertEquals(events[0] instanceof PaymentFailed, true);
});

Deno.test("Payment - cannot transition twice", () => {
  const successPayment = createPayment();
  successPayment.markAsSuccess(ExternalId.create("ext-456"));

  assertThrows(() => successPayment.markAsFailed(FailureReason.create("Too late")), Error);

  const failedPayment = createPayment();
  failedPayment.markAsFailed(FailureReason.create("Declined"));

  assertThrows(() => failedPayment.markAsSuccess(ExternalId.create("ext-789")), Error);
});

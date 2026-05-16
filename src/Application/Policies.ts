import { WhenSuggestionCreatedConsoleLogSuggestion } from "@/Application/Ticketing/Suggestions/mod.ts";
import { SuggestionCreatedDomainEvent } from "@/Domain/Ticketing/Suggestions/mod.ts";
import { WhenPaymentSucceededThenMarkOrderAsPaid } from "@/Application/Ticketing/Payments/mod.ts";
import { PaymentSuccess } from "@/Domain/Ticketing/Payments/mod.ts";
import { WhenOrderPaidThenReleaseTickets } from "@/Application/Ticketing/Orders/mod.ts";
import { OrderPaid } from "@/Domain/Ticketing/Orders/mod.ts";

export const domainEventPolicies: Map<string, string[]> = new Map([
  [SuggestionCreatedDomainEvent.FQDN_VALUE.toString(), [WhenSuggestionCreatedConsoleLogSuggestion.name]],
  [PaymentSuccess.FQDN.toString(), [WhenPaymentSucceededThenMarkOrderAsPaid.name]],
  [OrderPaid.FQDN.toString(), [WhenOrderPaidThenReleaseTickets.name]],
]);

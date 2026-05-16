import { ServiceCollection, ServiceProvider } from "@domaincrafters/di";

import {
  CreateSuggestionUseCase,
  type CreateSuggestionUseCaseInput,
  GetSuggestionByIdQueryUseCase,
  type GetSuggestionByIdQueryUseCaseInput,
  ListSuggestionsQueryUseCase,
  WhenSuggestionCreatedConsoleLogSuggestion,
} from "@/Application/Ticketing/Suggestions/mod.ts";

import { SaveMovie, type SaveMovieInput } from "@/Application/Ticketing/Movies/mod.ts";
import {
  AddCustomerToOrder,
  type AddCustomerToOrderUseCaseInput,
  CreateOrderFromBooking,
  type CreateOrderFromBookingUseCaseInput,
  GetOrderByBookingId,
  type GetOrderByBookingIdInput,
  MarkOrderAsPaid,
  type MarkOrderAsPaidInput,
  WhenOrderPaidThenReleaseTickets,
  ReleaseTicket,
  type ReleaseTicketInput,
} from "@/Application/Ticketing/Orders/mod.ts";
import { type PayOrderInput, PayOrderUseCase } from "@/Application/Ticketing/Payments/mod.ts";
import { WhenPaymentSucceededThenMarkOrderAsPaid } from "@/Application/Ticketing/Payments/mod.ts";
import { domainEventPolicies } from "@/Application/mod.ts";
import type { Logger, UseCase } from "@/Application/Ports/mod.ts";
import type { OrderData, SuggestionByIdReadModel, SuggestionListItemReadModel } from "@/Application/Ports/Queries/mod.ts";
import { DomainEventRegistry } from "@/Infrastructure/Events/Shared/mod.ts";
import { PolicyDomainEventListener } from "@/Infrastructure/Events/mod.ts";
import {
  MongoDbGetOrderByBookingIdQuery,
  MongoDbGetSuggestionByIdQuery,
  MongoDbListSuggestionsQuery,
} from "@/Infrastructure/Persistence/MongoDb/Queries/mod.ts";
import { MongoDbUnitOfWork } from "@/Infrastructure/Persistence/MongoDb/Shared/mod.ts";
import { Config, ConsoleLogger } from "@/Infrastructure/Shared/mod.ts";
import { Module } from "@/Main/Modules/Shared/mod.ts";
import { OnlinePaymentService } from "@/Infrastructure/Payment/mod.ts";

export class Application implements Module {
  add(serviceCollection: ServiceCollection, _config: Config): void {
    console.log("Application module added");
    this.addUseCases(serviceCollection);
    this.addPolicies(serviceCollection);

    serviceCollection.addScoped(OnlinePaymentService.name, () => Promise.resolve(new OnlinePaymentService()));
  }

  private addUseCases(serviceCollection: ServiceCollection): void {
    serviceCollection.addScoped(CreateSuggestionUseCase.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<CreateSuggestionUseCaseInput, string> = new CreateSuggestionUseCase(unitOfWork, logger);

      return useCase;
    });

    serviceCollection.addScoped(SaveMovie.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<SaveMovieInput, string> = new SaveMovie(unitOfWork, logger);

      return useCase;
    });

    serviceCollection.addScoped(CreateOrderFromBooking.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<CreateOrderFromBookingUseCaseInput, string> = new CreateOrderFromBooking(unitOfWork, logger);

      return useCase;
    });

    serviceCollection.addScoped(AddCustomerToOrder.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<AddCustomerToOrderUseCaseInput, string> = new AddCustomerToOrder(unitOfWork, logger);

      return useCase;
    });

    serviceCollection.addScoped(ListSuggestionsQueryUseCase.name, async (serviceProvider: ServiceProvider) => {
      const query = (await serviceProvider.getService<MongoDbListSuggestionsQuery>(MongoDbListSuggestionsQuery.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<void, SuggestionListItemReadModel[]> = new ListSuggestionsQueryUseCase(query, logger);

      return useCase;
    });

    serviceCollection.addScoped(GetSuggestionByIdQueryUseCase.name, async (serviceProvider: ServiceProvider) => {
      const query = (await serviceProvider.getService<MongoDbGetSuggestionByIdQuery>(MongoDbGetSuggestionByIdQuery.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<GetSuggestionByIdQueryUseCaseInput, SuggestionByIdReadModel> = new GetSuggestionByIdQueryUseCase(query, logger);

      return useCase;
    });
    serviceCollection.addScoped(GetOrderByBookingId.name, async (serviceProvider: ServiceProvider) => {
      const query = (await serviceProvider.getService<MongoDbGetOrderByBookingIdQuery>(MongoDbGetOrderByBookingIdQuery.name)).getOrThrow();
      const useCase: UseCase<GetOrderByBookingIdInput, OrderData> = new GetOrderByBookingId(query);

      return useCase;
    });

    serviceCollection.addScoped(PayOrderUseCase.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const paymentService = (await serviceProvider.getService<OnlinePaymentService>(OnlinePaymentService.name)).getOrThrow();

      const useCase: UseCase<PayOrderInput, string> = new PayOrderUseCase(unitOfWork, logger, paymentService);

      return useCase;
    });

    serviceCollection.addScoped(MarkOrderAsPaid.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<MarkOrderAsPaidInput, void> = new MarkOrderAsPaid(unitOfWork, logger);

      return useCase;
    });
    serviceCollection.addScoped(ReleaseTicket.name, async (serviceProvider: ServiceProvider) => {
      const unitOfWork = (await serviceProvider.getService<MongoDbUnitOfWork>(MongoDbUnitOfWork.name)).getOrThrow();

      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      const useCase: UseCase<ReleaseTicketInput, void> = new ReleaseTicket(unitOfWork, logger);

      return useCase;
    });
  }

  private addPolicies(serviceCollection: ServiceCollection): void {
    serviceCollection.addScoped(WhenSuggestionCreatedConsoleLogSuggestion.name, async (serviceProvider: ServiceProvider) => {
      const logger = (await serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

      return new WhenSuggestionCreatedConsoleLogSuggestion(logger);
    });

    serviceCollection.addScoped(WhenPaymentSucceededThenMarkOrderAsPaid.name, async (serviceProvider: ServiceProvider) => {
      const markOrderAsPaidUseCase = (await serviceProvider.getService<MarkOrderAsPaid>(MarkOrderAsPaid.name)).getOrThrow();

      return new WhenPaymentSucceededThenMarkOrderAsPaid(markOrderAsPaidUseCase);
    });
    serviceCollection.addScoped(WhenOrderPaidThenReleaseTickets.name, async (serviceProvider: ServiceProvider) => {
      const releaseTicketUseCase = (await serviceProvider.getService<ReleaseTicket>(ReleaseTicket.name)).getOrThrow();

      return new WhenOrderPaidThenReleaseTickets(releaseTicketUseCase);
    });
  }

  async use(serviceProvider: ServiceProvider): Promise<void> {
    console.log("Application module use - Wiring policyregistry");

    // Get event bus from DI container
    const eventListener = (await serviceProvider.getService<PolicyDomainEventListener>("PolicyDomainEventListener")).getOrThrow();

    // Create policy registry (Infrastructure)
    const policyregistry = new DomainEventRegistry([eventListener]);

    console.log("Application module use - Registering policies from Application layer mapping", domainEventPolicies);

    // Register policies from Application layer mapping
    // Policy instances are NOT resolved here - the EventBus will resolve them
    // with a fresh scope when handling each event
    policyregistry.registerFromMapping(domainEventPolicies);

    // Subscribe all policyregistry to event bus
    await policyregistry.subscribeAll();
  }

  static create(): Module {
    return new Application();
  }
}

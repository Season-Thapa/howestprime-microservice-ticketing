import { ServiceProvider } from "@domaincrafters/di";

import {
  CreateSuggestionUseCase,
  type CreateSuggestionUseCaseInput,
  GetSuggestionByIdQueryUseCase,
  type GetSuggestionByIdQueryUseCaseInput,
  ListSuggestionsQueryUseCase,
} from "@/Application/Ticketing/Suggestions/mod.ts";
import { SaveMovie, type SaveMovieInput } from "@/Application/Ticketing/Movies/mod.ts";
import type { UseCase, Logger } from "@/Application/Ports/mod.ts";
import type { SuggestionByIdReadModel, SuggestionListItemReadModel } from "@/Application/Ports/Queries/mod.ts";
import {
  CreateSuggestionController,
  GetSuggestionByIdController,
  ListSuggestionsController,
  CreateOrderFromBookingController,
  SaveMovieController,
} from "@/Infrastructure/WebApi/Controllers/mod.ts";
import { type ControllerFactory, type RouterContext, type WebApiController } from "@/Infrastructure/WebApi/Shared/mod.ts";
import { IllegalStateException } from "@domaincrafters/std";
import { ConsoleLogger } from "@/Infrastructure/Shared/mod.ts";
import { CreateOrderFromBooking, type CreateOrderFromBookingUseCaseInput } from "@/Application/Ticketing/Orders/mod.ts";

export class WebApiControllerFactory implements ControllerFactory {
  private readonly _serviceProvider: ServiceProvider;

  constructor(serviceProvider: ServiceProvider) {
    this._serviceProvider = serviceProvider;
  }

  async create(ctx: RouterContext<string>): Promise<WebApiController> {
    if (!ctx.routeName) {
      throw new IllegalStateException("Route name is not defined");
    }

    switch (ctx.routeName) {
      case CreateSuggestionController.name:
        return await this.createCreateSuggestionController();
      case ListSuggestionsController.name:
        return await this.createListSuggestionsController();
      case GetSuggestionByIdController.name:
        return await this.createGetSuggestionByIdController();
      case SaveMovieController.name:
        return await this.createSaveMovieController();
      case CreateOrderFromBookingController.name:
        return await this.createCreateOrderFromBookingController();

      default:
        throw new IllegalStateException(`Controller for route ${ctx.routeName} is not defined`);
    }
  }

  private async createCreateSuggestionController(): Promise<CreateSuggestionController> {
    const useCase = (
      await this._serviceProvider.getService<UseCase<CreateSuggestionUseCaseInput, string>>(CreateSuggestionUseCase.name)
    ).getOrThrow();

    return new CreateSuggestionController(useCase);
  }

  private async createListSuggestionsController(): Promise<ListSuggestionsController> {
    const useCase = (
      await this._serviceProvider.getService<UseCase<void, SuggestionListItemReadModel[]>>(ListSuggestionsQueryUseCase.name)
    ).getOrThrow();

    return new ListSuggestionsController(useCase);
  }

  private async createGetSuggestionByIdController(): Promise<GetSuggestionByIdController> {
    const useCase = (
      await this._serviceProvider.getService<UseCase<GetSuggestionByIdQueryUseCaseInput, SuggestionByIdReadModel>>(GetSuggestionByIdQueryUseCase.name)
    ).getOrThrow();

    return new GetSuggestionByIdController(useCase);
  }

  private async createSaveMovieController(): Promise<SaveMovieController> {
    const useCase = (await this._serviceProvider.getService<UseCase<SaveMovieInput, string>>(SaveMovie.name)).getOrThrow();

    const logger = (await this._serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

    return new SaveMovieController(useCase, logger);
  }

  private async createCreateOrderFromBookingController(): Promise<CreateOrderFromBookingController> {
    const useCase = (
      await this._serviceProvider.getService<UseCase<CreateOrderFromBookingUseCaseInput, string>>(CreateOrderFromBooking.name)
    ).getOrThrow();

    const logger = (await this._serviceProvider.getService<Logger>(ConsoleLogger.name)).getOrThrow();

    return new CreateOrderFromBookingController(useCase, logger);
  }
}

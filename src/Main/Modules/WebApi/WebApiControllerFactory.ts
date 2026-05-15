import { ServiceProvider } from '@domaincrafters/di';

import {
    CreateSuggestionUseCase,
    type CreateSuggestionUseCaseInput,
    GetSuggestionByIdQueryUseCase,
    type GetSuggestionByIdQueryUseCaseInput,
    ListSuggestionsQueryUseCase,
} from '@/Application/Ticketing/Suggestions/mod.ts';
import { SaveMovie, type SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { Logger, UseCase } from '@/Application/Ports/mod.ts';
import type {
    OrderData,
    SuggestionByIdReadModel,
    SuggestionListItemReadModel,
} from '@/Application/Ports/Queries/mod.ts';
import {
    AddCustomerToOrderController,
    CreateOrderFromBookingController,
    CreateSuggestionController,
    GetOrderByBookingIdController,
    GetSuggestionByIdController,
    ListSuggestionsController,
    SaveMovieController,
} from '@/Infrastructure/WebApi/Controllers/mod.ts';
import {
    type ControllerFactory,
    type RouterContext,
    type WebApiController,
} from '@/Infrastructure/WebApi/Shared/mod.ts';
import { IllegalStateException } from '@domaincrafters/std';
import { ConsoleLogger } from '@/Infrastructure/Shared/mod.ts';
import {
    AddCustomerToOrder,
    type AddCustomerToOrderUseCaseInput,
    CreateOrderFromBooking,
    type CreateOrderFromBookingUseCaseInput,
    GetOrderByBookingId,
    type GetOrderByBookingIdInput,
} from '@/Application/Ticketing/Orders/mod.ts';

export class WebApiControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
    }

    async create(ctx: RouterContext<string>): Promise<WebApiController> {
        if (!ctx.routeName) {
            throw new IllegalStateException('Route name is not defined');
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
            case AddCustomerToOrderController.name:
                return await this.createAddCustomerToOrderController();
            case GetOrderByBookingIdController.name:
                return await this.createGetOrderByBookingIdController();

            default:
                throw new IllegalStateException(
                    `Controller for route ${ctx.routeName} is not defined`,
                );
        }
    }

    private async createCreateSuggestionController(): Promise<CreateSuggestionController> {
        const useCase = (
            await this._serviceProvider.getService<UseCase<CreateSuggestionUseCaseInput, string>>(
                CreateSuggestionUseCase.name,
            )
        ).getOrThrow();

        return new CreateSuggestionController(useCase);
    }

    private async createListSuggestionsController(): Promise<ListSuggestionsController> {
        const useCase = (
            await this._serviceProvider.getService<UseCase<void, SuggestionListItemReadModel[]>>(
                ListSuggestionsQueryUseCase.name,
            )
        ).getOrThrow();

        return new ListSuggestionsController(useCase);
    }

    private async createGetSuggestionByIdController(): Promise<GetSuggestionByIdController> {
        const useCase = (
            await this._serviceProvider.getService<
                UseCase<GetSuggestionByIdQueryUseCaseInput, SuggestionByIdReadModel>
            >(GetSuggestionByIdQueryUseCase.name)
        ).getOrThrow();

        return new GetSuggestionByIdController(useCase);
    }
    private async createGetOrderByBookingIdController(): Promise<GetOrderByBookingIdController> {
        const useCase = (
            await this._serviceProvider.getService<
                UseCase<GetOrderByBookingIdInput, OrderData>
            >(GetOrderByBookingId.name)
        ).getOrThrow();

        return new GetOrderByBookingIdController(useCase);
    }

    private async createSaveMovieController(): Promise<SaveMovieController> {
        const useCase = (await this._serviceProvider.getService<UseCase<SaveMovieInput, string>>(
            SaveMovie.name,
        )).getOrThrow();

        const logger = (await this._serviceProvider.getService<Logger>(ConsoleLogger.name))
            .getOrThrow();

        return new SaveMovieController(useCase, logger);
    }

    private async createCreateOrderFromBookingController(): Promise<
        CreateOrderFromBookingController
    > {
        const useCase = (
            await this._serviceProvider.getService<
                UseCase<CreateOrderFromBookingUseCaseInput, string>
            >(CreateOrderFromBooking.name)
        ).getOrThrow();

        const logger = (await this._serviceProvider.getService<Logger>(ConsoleLogger.name))
            .getOrThrow();

        return new CreateOrderFromBookingController(useCase, logger);
    }

    private async createAddCustomerToOrderController(): Promise<AddCustomerToOrderController> {
        const useCase = (
            await this._serviceProvider.getService<
                UseCase<AddCustomerToOrderUseCaseInput, string>
            >(AddCustomerToOrder.name)
        ).getOrThrow();

        const logger = (await this._serviceProvider.getService<Logger>(ConsoleLogger.name))
            .getOrThrow();

        return new AddCustomerToOrderController(useCase, logger);
    }
}

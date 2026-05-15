import { ServiceProvider } from '@domaincrafters/di';

import {
    CreateSuggestionUseCase,
    type CreateSuggestionUseCaseInput,
} from '@/Application/Ticketing/Suggestions/mod.ts';
import { SaveMovie, type SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { UseCase } from '@/Application/Ports/mod.ts';
import {
    CreateOrderFromBookingController,
    CreateOrderFromBookingRequest,
    CreateSuggestionController,
    type CreateSuggestionRequest,
    MovieRegisteredController,
    type MovieRegisteredRequest,
} from '@/Infrastructure/Messaging/LavinMQ/Controllers/mod.ts';

import {
    type AmqpController,
    type ControllerFactory,
} from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import type { ConsumerContext } from '@/Infrastructure/Messaging/LavinMQ/Shared/Amqp/AmqpBrokerConfigurator.ts';
import { IllegalStateException } from '@domaincrafters/std';
import {
    CreateOrderFromBooking,
    type CreateOrderFromBookingUseCaseInput,
} from '@/Application/Ticketing/Orders/CreateOrderFromBooking.ts';

export class AmqpControllerFactory implements ControllerFactory {
    private readonly _serviceProvider: ServiceProvider;

    constructor(serviceProvider: ServiceProvider) {
        this._serviceProvider = serviceProvider;
        console.log('AmqpControllerFactory initialized', this._serviceProvider.toString());
    }

    create(consumerContext: ConsumerContext): Promise<AmqpController<unknown>> {
        const operationId: string = consumerContext.operationId;
        const eventName: string = consumerContext.eventName;
        const normalizedOperationId = operationId.toLowerCase();

        switch (normalizedOperationId) {
            case 'whensuggestionsendcreatesuggestion':
                return this.createCreateSuggestionController();
            case 'whenmovieregistered':
                return this.createMovieRegisteredController();
            case 'whenbookingopened':
            case 'whenordercreatedfrombooking':
                return this.createCreateOrderFromBookingController();
        }

        const normalizedEventName = eventName.toLowerCase();
        switch (normalizedEventName) {
            case 'thirdparty.service.demo.suggestion.sendcreatesuggestion':
                return this.createCreateSuggestionController();
            case 'howestprime.movies.movie.movieregistered':
                return this.createMovieRegisteredController();
            case 'howestprime.movies.movieevent.bookingopened':
                return this.createCreateOrderFromBookingController();

            default:
                throw new IllegalStateException(
                    `No controller is defined for operation '${operationId}' and event '${eventName}'`,
                );
        }
    }

    private async createCreateSuggestionController(): Promise<AmqpController<unknown>> {
        const useCase = (
            await this._serviceProvider.getService<UseCase<CreateSuggestionUseCaseInput, string>>(
                CreateSuggestionUseCase.name,
            )
        ).getOrThrow();

        return new CreateSuggestionController(useCase) as AmqpController<CreateSuggestionRequest>;
    }

    private async createMovieRegisteredController(): Promise<AmqpController<unknown>> {
        const useCase = (await this._serviceProvider.getService<UseCase<SaveMovieInput, string>>(
            SaveMovie.name,
        )).getOrThrow();

        return new MovieRegisteredController(useCase) as AmqpController<MovieRegisteredRequest>;
    }
    private async createCreateOrderFromBookingController(): Promise<AmqpController<unknown>> {
        const useCase = (await this._serviceProvider.getService<
            UseCase<CreateOrderFromBookingUseCaseInput, string>
        >(CreateOrderFromBooking.name)).getOrThrow();

        return new CreateOrderFromBookingController(useCase) as AmqpController<
            CreateOrderFromBookingRequest
        >;
    }
}

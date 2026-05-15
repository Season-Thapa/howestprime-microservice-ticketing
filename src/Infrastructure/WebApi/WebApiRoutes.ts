import {
    AddCustomerToOrderController,
    CreateOrderFromBookingController,
    CreateSuggestionController,
    GetSuggestionByIdController,
    ListSuggestionsController,
    SaveMovieController,
    GetOrderByBookingIdController
} from '@/Infrastructure/WebApi/Controllers/mod.ts';
import { type Router, RouterBuilder, type Routes } from '@/Infrastructure/WebApi/Shared/mod.ts';

export class WebApiRoutes implements Routes {
    map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapGet(ListSuggestionsController.name, '/api/suggestions')
            .mapPost(CreateSuggestionController.name, '/api/suggestions')
            .mapGet(GetSuggestionByIdController.name, '/api/suggestions/:suggestionId')
            .mapPost(SaveMovieController.name, '/api/movies')
            .mapPost(CreateOrderFromBookingController.name, '/api/orders/from-booking')
            .mapPost(AddCustomerToOrderController.name, '/api/orders/:orderId/customer')
            .mapGet(GetOrderByBookingIdController.name, '/api/orders/:bookingId')
            .build();
    }
}

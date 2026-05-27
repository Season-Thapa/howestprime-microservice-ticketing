import type { UseCase } from '@/Application/Ports/mod.ts';
import type { SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { AmqpController } from '@/Infrastructure/Messaging/LavinMQ/Shared/mod.ts';
import { Guard } from '@domaincrafters/std';

export interface MovieRegisteredRequest {
    movieId: string;
    title: string;
    duration: number;
    genres: string[];
    ageRating: string;
    posterUrl: string;
}

export class MovieRegisteredController implements AmqpController<MovieRegisteredRequest> {
    constructor(private readonly _saveMovieUseCase: UseCase<SaveMovieInput, string>) {}

    async handle(request: MovieRegisteredRequest): Promise<void> {
        console.log('=== INCOMING AMQP MESSAGE START ===');
        console.log(JSON.stringify(request, null, 2));
        console.log('=== INCOMING AMQP MESSAGE END ===');
        const input = this.extractInput(request);
        await this._saveMovieUseCase.execute(input);
    }

    private extractInput(request: MovieRegisteredRequest): SaveMovieInput {
        Guard.check(request.movieId).againstWhitespace();
        Guard.check(request.title).againstWhitespace();
        Guard.check(request.duration).againstNullOrUndefined();
        Guard.check(request.genres).againstEmpty();
        Guard.check(request.ageRating).againstEmpty();
        Guard.check(request.posterUrl).againstWhitespace();

        return {
            movieId: request.movieId,
            title: request.title,
            duration: request.duration,
            genres: request.genres,
            ageRating: request.ageRating,
            posterUrl: request.posterUrl,
        };
    }
}

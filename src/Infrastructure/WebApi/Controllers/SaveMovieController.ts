import {
    type RouterContext,
    type WebApiController
} from '@/Infrastructure/WebApi/Shared/mod.ts';
import { SaveMovieInput } from '@/Application/Ticketing/Movies/mod.ts';
import type { Logger, UseCase }  from '@/Application/Ports/mod.ts'


export class SaveMovieController implements WebApiController {
    private readonly _useCase: UseCase<SaveMovieInput, string>;
    private readonly _logger: Logger;
    constructor(useCase: UseCase<SaveMovieInput, string>, logger: Logger) {
        this._useCase = useCase;
        this._logger = logger;
    }
    async handle(ctx: RouterContext<string>): Promise<void> {
        const body = await ctx.request.body.json();
        if (!this.validateBody(body)) {
            ctx.throw(400, 'Invalid input for movie registration');
        }
        this._logger.info('Received request to save movie', {
        movieId: body.movieId,
        title: body.title,
        duration: body.duration,
        ageRating: body.ageRating,
        genres: body.genres,
        posterUrl: body.posterUrl
    });
    const id: string = await this._useCase.execute({
        movieId: body.movieId,
        title: body.title,
        duration: body.duration,
        ageRating: body.ageRating,
        genres: body.genres,
        posterUrl: body.posterUrl
    });
    ctx.response.status = 201;
    ctx.response.body = {movieId: id};


    }
    private validateBody(body: unknown): boolean {
        if (typeof body !== 'object' || body === null) {
            return false;
        }

        const payload = body as Record<string, unknown>;

        return (
            typeof payload.movieId === 'string' &&
            typeof payload.title === 'string' &&
            typeof payload.duration === 'number' &&
            typeof payload.ageRating === 'string' &&
            Array.isArray(payload.genres) &&
            typeof payload.posterUrl === 'string'
        );
    }
}
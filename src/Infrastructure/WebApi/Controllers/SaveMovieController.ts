import { RouterContext } from '@oak/oak';
import { WebApiController } from '../Shared/mod.ts';
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
    if (!body || typeof body.name !== 'string' || typeof body.date !== 'string' ||
        typeof body.type !== 'string')
    {
        ctx.throw(400, 'Invalid input');
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



}
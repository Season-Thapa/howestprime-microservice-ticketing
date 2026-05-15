import type { Logger, UnitOfWork, UseCase } from '@/Application/Ports/mod.ts';
import {
    AgeRating,
    Genre,
    Movie,
    MovieDuration,
    MovieId,
    MovieTitle,
    PosterUrl,
} from '@/Domain/Ticketing/Movies/mod.ts';

export interface SaveMovieInput {
    movieId: string;
    title: string;
    duration: number;
    ageRating: string;
    genres: string[];
    posterUrl: string;
}
export class SaveMovie implements UseCase<SaveMovieInput, string> {
    private readonly _unitOfWork: UnitOfWork;
    private readonly _logger: Logger;

    constructor(
        unitOfWork: UnitOfWork,
        logger: Logger,
    ) {
        this._unitOfWork = unitOfWork;
        this._logger = logger;
    }
    async execute(input: SaveMovieInput): Promise<string> {
        this._logger.debug('Saving movie', { input });
        const result = await this._unitOfWork.do<string>(async () => {
            const movie = Movie.create(
                MovieId.create(input.movieId),
                MovieTitle.create(input.title),
                AgeRating.create(input.ageRating),
                input.genres.map((genre) => Genre.create(genre)),
                MovieDuration.create(input.duration),
                PosterUrl.create(input.posterUrl),
            );
            this._logger.info('Movie registered', { movie });
            await this._unitOfWork.save(movie);
            return movie.id.toString();
        });
        return result;
    }
}

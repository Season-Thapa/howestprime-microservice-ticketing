import { AggregateRoot, UUIDEntityId } from '@/Domain/Shared/mod.ts';
import { MovieTitle } from '../../Shared/ValueObjects/MovieTitle.ts';
import { AgeRating } from '../../Shared/ValueObjects/AgeRating.ts';
import { Genre, InvalidGenreException } from '../../Shared/ValueObjects/Genre.ts';
import { MovieDuration } from '../../Shared/ValueObjects/MovieDuration.ts';
import { PosterUrl } from '../../Shared/ValueObjects/PosterUrl.ts';
import { Money } from '../../Shared/ValueObjects/Money.ts';

export class MovieId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(value?: string): MovieId {
        return new MovieId(value);
    }
}

export class Movie extends AggregateRoot<MovieId> {
    private readonly _externalId: string;
    private readonly _title: MovieTitle;
    private readonly _ageRating: AgeRating;
    private readonly _genres: Genre[];
    private readonly _movieDuration: MovieDuration;
    private readonly _posterUrl: PosterUrl;
    private readonly _price: Money;

    private constructor(
        id: MovieId,
        externalId: string,
        title: MovieTitle,
        ageRating: AgeRating,
        genres: Genre[],
        movieDuration: MovieDuration,
        posterUrl: PosterUrl,
        price: Money,
    ) {
        super(id);
        this._externalId = externalId;
        this._title = title;
        this._ageRating = ageRating;
        this._genres = genres;
        this._movieDuration = movieDuration;
        this._posterUrl = posterUrl;
        this._price = price;
    }

    static create(
        externalId: string,
        title: MovieTitle,
        ageRating: AgeRating,
        genre: Genre[],
        movieDuration: MovieDuration,
        posterUrl: PosterUrl,
    ): Movie {
        const id = MovieId.create();
        const calculatedPrice = Money.create(movieDuration.duration * 0.15);
        const movie = new Movie(
            id,
            externalId,
            title,
            ageRating,
            genre,
            movieDuration,
            posterUrl,
            calculatedPrice,
        );
        movie.validate();
        return movie;
    }
    get title(): MovieTitle {
        return this._title;
    }

    get ageRating(): AgeRating {
        return this._ageRating;
    }

    get genres(): Genre[] {
        return this._genres;
    }
    get externalId(): string {
        return this._externalId;
    }
    get duration(): MovieDuration {
        return this._movieDuration;
    }

    get posterUrl(): PosterUrl {
        return this._posterUrl;
    }

    get price(): Money {
        return this._price;
    }
    protected validate(): void {
        if (this._genres.length === 0) {
            throw new InvalidGenreException('At least one genre must be provided for movie.');
        }
    }
}

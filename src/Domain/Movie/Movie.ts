import {AggregateRoot,UUIDEntityId} from "@/Domain/Shared/mod.ts";
import {MovieTitle} from "../Shared/ValueObjects/MovieTitle.ts";
import {AgeRating} from "../Shared/ValueObjects/AgeRating.ts";
import {Genre, InvalidGenreException} from "../Shared/ValueObjects/Genre.ts";
import {MovieDuration} from "../Shared/ValueObjects/MovieDuration.ts";
import {PosterUrl} from "../Shared/ValueObjects/PosterUrl.ts";
import {Money} from "../Shared/ValueObjects/Money.ts";

export class MovieId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(value?: string): MovieId {
        return new MovieId(value);
    }
}
export class Movie extends AggregateRoot<MovieId> {
    private readonly _title: MovieTitle;
    private readonly _ageRating: AgeRating;
    private readonly _genres: Genre[];
    private readonly _movieDuration: MovieDuration;
    private readonly _posterUrl: PosterUrl;
    private readonly _price: Money;

    private constructor(
        id: MovieId,
        title: MovieTitle,
        ageRating: AgeRating,
        genres: Genre[],
        movieDuration: MovieDuration,
        posterUrl: PosterUrl,
        price: Money
    ) {
        super(id);
        this._title = title;
        this._ageRating = ageRating;
        this._genres = genres;
        this._movieDuration = movieDuration;
        this._posterUrl = posterUrl;
        this._price = price;
    }

    static create(
        id: MovieId,
        title: MovieTitle,
        ageRating: AgeRating,
        genre: Genre[],
        movieDuration: MovieDuration,
        posterUrl: PosterUrl,
        price: Money
    ): Movie {
        const movie = new Movie(
            id,
            title,
            ageRating,
            genre,
            movieDuration,
            posterUrl,
            price
        );
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
            throw new InvalidGenreException("At least one genre must be provided for movie.");
        }
    }
}
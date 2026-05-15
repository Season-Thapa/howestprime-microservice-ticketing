import { EventFQDN } from '@/Domain/Shared/DomainEvents/EventFQDN.ts';
import { MovieDomainEvent } from './MovieDomainEvent.ts';

export class MovieRegistered extends MovieDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${MovieDomainEvent.FQDN_PREFIX}.movieregistered`,
    );
    private readonly _movieId: string;
    private readonly _title: string;
    private readonly _releaseYear: number;
    private readonly _duration: number;
    private readonly _genres: string[];
    private readonly _actors: string[];
    private readonly _ageRating: string;
    private readonly _posterUrl: string;
    private readonly _occurredOn: Date;

    private constructor(
        movieId: string,
        title: string,
        releaseYear: number,
        duration: number,
        genres: string[],
        actors: string[],
        ageRating: string,
        posterUrl: string,
    ) {
        super();
        this._movieId = movieId;
        this._title = title;
        this._releaseYear = releaseYear;
        this._duration = duration;
        this._genres = genres;
        this._actors = actors;
        this._ageRating = ageRating;
        this._posterUrl = posterUrl;
        this._occurredOn = new Date();
    }
    static create(
        movieId: string,
        title: string,
        releaseYear: number,
        duration: number,
        genres: string[],
        actors: string[],
        ageRating: string,
        posterUrl: string,
    ): MovieRegistered {
        return new MovieRegistered(
            movieId,
            title,
            releaseYear,
            duration,
            genres,
            actors,
            ageRating,
            posterUrl,
        );
    }

    get movieId(): string {
        return this._movieId;
    }

    get title(): string {
        return this._title;
    }

    get releaseYear(): number {
        return this._releaseYear;
    }

    get duration(): number {
        return this._duration;
    }

    get genres(): string[] {
        return this._genres;
    }

    get actors(): string[] {
        return this._actors;
    }

    get ageRating(): string {
        return this._ageRating;
    }

    get posterUrl(): string {
        return this._posterUrl;
    }

    get occurredOn(): Date {
        return this._occurredOn;
    }
    override get FQDN(): EventFQDN {
        return MovieRegistered.FQDN;
    }
}

import {EventFQDN} from "@/Domain/Shared/DomainEvents/EventFQDN.ts";
import {BookingDomainEvent} from "./BookingDomainEvent.ts";

export class BookingOpened extends BookingDomainEvent {
    static readonly FQDN: EventFQDN = EventFQDN.create(
        `${BookingDomainEvent.FQDN_PREFIX}.booking_opened`,
    );
    private readonly _bookingId: string;
    private readonly _movieId: string;
    private readonly _room: string;
    private readonly _showtime: Date;
    private readonly _standardVisitors: number;
    private readonly _discountedVisitors: number;
    private readonly _seatNumbers: number[];
    private readonly _occurredOn: Date;

    private constructor(
        bookingId: string,
        movieId: string,
        room: string,
        showtime: Date,
        standardVisitors: number,
        discountedVisitors: number,
        seatNumbers: number[]
    ) {
        super();
        this._bookingId = bookingId;
        this._movieId = movieId;
        this._room = room;
        this._showtime = showtime;
        this._standardVisitors = standardVisitors;
        this._discountedVisitors = discountedVisitors;
        this._seatNumbers = seatNumbers;
        this._occurredOn = new Date();
    }
    static create(
        bookingId: string,
        movieId: string,
        room: string,
        showtime: Date,
        standardVisitors: number,
        discountedVisitors: number,
        seatNumbers: number[]
    ): BookingOpened {
        return new BookingOpened(
            bookingId,
            movieId,
            room,
            showtime,
            standardVisitors,
            discountedVisitors,
            seatNumbers
        );
    }
    get bookingId(): string {
        return this._bookingId;
    }
    get movieId(): string {
        return this._movieId;
    }
    get room(): string {
        return this._room;
    }
    get showtime(): Date {
        return this._showtime;
    }
    get standardVisitors(): number {
        return this._standardVisitors;
    }
    get discountedVisitors(): number {
        return this._discountedVisitors;
    }
    get seatNumbers(): number[] {
        return this._seatNumbers;
    }

    get occurredOn(): Date {
        return this._occurredOn;
    }
    override get FQDN(): EventFQDN {
        return BookingOpened.FQDN;
    }

}
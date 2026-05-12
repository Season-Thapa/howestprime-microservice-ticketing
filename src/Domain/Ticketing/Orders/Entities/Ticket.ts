import { Entity, UUIDEntityId } from "@/Domain/Shared/mod.ts";
import { Money } from "../../../Shared/ValueObjects/Money.ts";
import { MovieInfo } from "../ValueObjects/MovieInfo.ts";
import {Seat, VisitorType} from "../ValueObjects/Seat.ts";
export class TicketId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(value?: string): TicketId {
        return new TicketId(value);
    }
}

export class Ticket extends Entity<TicketId> {
    private readonly _movieInfo: MovieInfo;
    private readonly _seat: Seat;
    private readonly _room: string;
    private readonly _price: Money;
    private readonly _showtime: Date;

    private constructor(
        id: TicketId,
        movieInfo: MovieInfo,
        seat: Seat,
        room: string,
        price: Money,
        showtime: Date
    ) {
        super(id);
        this._movieInfo = movieInfo;
        this._seat = seat;
        this._room = room;
        this._price = price;
        this._showtime = showtime;
    }

    static create(
        movieInfo: MovieInfo,
        seat: Seat,
        room: string,
        showtime: Date
    ): Ticket {
        const multiplier = seat.visitorType === VisitorType.Discounted ? 0.9 : 1.0;
        const ticketPrice = Money.create(movieInfo.price.amount * multiplier);
        const ticket = new Ticket(
            TicketId.create(),
            movieInfo,
            seat,
            room,
            ticketPrice,
            showtime
        );
        ticket.validate();
        return ticket;
    }

    get movieInfo(): MovieInfo {
        return this._movieInfo;
    }

    get seat(): Seat {
        return this._seat;
    }

    get room(): string {
        return this._room;
    }

    get price(): Money {
        return this._price;
    }

    get showtime(): Date {
        return this._showtime;
    }

    protected validate(): void {
        if (!this._room || this._room.trim() === "") {
            throw new Error("Room cannot be empty.");
        }
    }
}
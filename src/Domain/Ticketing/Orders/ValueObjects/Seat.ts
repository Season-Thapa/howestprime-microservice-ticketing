import { ValueObject } from '@/Domain/Shared/mod.ts';

export enum VisitorType {
    Standard = 'standard',
    Discounted = 'discounted',
}

export class Seat extends ValueObject {
    private readonly _seatNumber: number;
    private readonly _visitorType: VisitorType;

    private constructor(seatNumber: number, visitorType: VisitorType) {
        super();
        this._seatNumber = seatNumber;
        this._visitorType = visitorType;
    }

    public static create(seatNumber: number, visitorType: VisitorType): Seat {
        const seat = new Seat(seatNumber, visitorType);
        seat.validate();
        return seat;
    }

    get seatNumber(): number {
        return this._seatNumber;
    }

    get visitorType(): VisitorType {
        return this._visitorType;
    }

    public equals(other: Seat): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        if (!(other instanceof Seat)) {
            return false;
        }
        return (
            this._seatNumber === other.seatNumber &&
            this._visitorType === other.visitorType
        );
    }
    protected validate(): void {
        if (this._seatNumber <= 0 || !Number.isInteger(this._seatNumber)) {
            throw new Error('Seat number must be a valid positive integer.');
        }
    }
}

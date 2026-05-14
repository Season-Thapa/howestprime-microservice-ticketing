import {Email, Entity, UUIDEntityId} from "@/Domain/Shared/mod.ts";
import {CustomerFirstName} from "../ValueObjects/CustomerFirstName.ts";
import {CustomerLastName} from "../ValueObjects/CustomerLastName.ts";

export enum CustomerSalutation {
    Mr = "Mr.",
    Ms = "Ms.",
    Mx = "Mx."

}
export class CustomerId extends UUIDEntityId {
    private constructor(id?: string) {
        super(id);
    }

    static create(value?: string): CustomerId {
        return new CustomerId(value);
    }
}

export class Customer extends Entity<CustomerId> {
    private readonly _salutation: CustomerSalutation;
    private readonly _firstName: CustomerFirstName;
    private readonly _lastName: CustomerLastName;
    private readonly _email: Email;

    private constructor(
        id: CustomerId,
        salutation: CustomerSalutation,
        firstName: CustomerFirstName,
        lastName: CustomerLastName,
        email: Email
    ) {
        super(id);
        this._salutation = salutation;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
    }

    static create(
        salutation: CustomerSalutation,
        firstName: CustomerFirstName,
        lastName: CustomerLastName,
        email: Email
    ): Customer {
        return new Customer(
            CustomerId.create(),
            salutation,
            firstName,
            lastName,
            email
        );
    }

    get salutation(): CustomerSalutation {
        return this._salutation;
    }

    get firstName(): CustomerFirstName {
        return this._firstName;
    }

    get lastName(): CustomerLastName {
        return this._lastName;
    }

    get email(): Email {
        return this._email;
    }


}
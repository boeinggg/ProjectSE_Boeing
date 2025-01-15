import { GenderInterface } from "./Gender";

export interface BiddersInterface {
    ID?: number;

    FirstName?: string;

    LastName?: string;

    Email?: string;

    PhoneNumber?: string;

    Age?: number;

    BirthDay?: string;
    Gender?: GenderInterface;
    GenderID?: number;
    Address?: string;
    // Password?: string;

    // UserID?: number;
}

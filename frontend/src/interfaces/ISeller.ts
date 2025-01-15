import { GenderInterface } from "./Gender";

export interface SellersInterface {
    ID?: number;

    Profile?: string;

    FirstName?: string;

    LastName?: string;

    PhoneNumber?: string;

    Email?: string;

    Age?: number;

    Address?: string;

    // BirthDay?: string;

    Gender?: GenderInterface;
    GenderID?: number;

    // Password?: string;

    // UserID?: number;
}

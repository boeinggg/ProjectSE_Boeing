import { ArtToysInterface } from "./ArtToy";

export interface AuctionInterface {
    ID?: number;

    StartPrice?: number;

    Bid?: number;

    CurrentPrice?: number;

    EndPrice?: number;

    StartDate?: Date;

    EndDate?: Date;

    Status?: string;

    ArtToy?: ArtToysInterface;
    ArtToyID?: number;
}

import { ArtToysInterface } from "./ArtToy";

export interface AuctionInterface {
    ID?: number;

    StartPrice?: number;

    BidIncrement?: number;

    CurrentPrice?: number;

    EndPrice?: number;

    StartDateTime?: Date;

    EndDateTime?: Date;

    Status?: string;

    ArtToy?: ArtToysInterface;
    ArtToyID?: number;
}

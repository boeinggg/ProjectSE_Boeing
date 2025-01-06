import { ArtToysInterface } from "./ArtToy";

export interface AuctionInterface {
    id?: number;

    startPrice?: number;

    bidIncrement?: number;

    CurrentPrice?: number;

    EndPrice?: number;

    startDateTime?: Date;

    endDateTime?: Date;

    status?: string;

    ArtToy?: ArtToysInterface;
    ArtToyID?: number;
}

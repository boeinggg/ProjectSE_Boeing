import { ArtToysInterface } from "./ArtToy";

export interface AuctionInterface {
    id?: number;

    startPrice?: number;

    bidIncrement?: number;

    CurrentPrice?: number;

    EndPrice?: number;

    startDate?: Date;

    endDate?: Date;

    status?: string;

    ArtToy?: ArtToysInterface;
    ArtToyID?: number;
}

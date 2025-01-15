import { AuctionInterface } from "./Auction";
import { BiddersInterface } from "./IBidder";

export interface BidsInterface {
    ID?: number;
    BidAmount?: number;
    Auction?: AuctionInterface;
    AuctionID?: number;
    Bidder?: BiddersInterface;
    BidderID?: number;
}

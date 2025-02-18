import { AuctionInterface } from "./Auction";
import { BiddersInterface } from "./IBidder";

export interface BidsInterface {
    ID?: number;
    BidAmount?: number;
    AuctionDetail?: AuctionInterface;
    AuctionDetailID?: number;
    Bidder?: BiddersInterface;
    BidderID?: number;
}

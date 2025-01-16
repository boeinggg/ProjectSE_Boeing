import { AuctionInterface } from "./Auction";
import { BiddersInterface } from "./IBidder";
import { SellersInterface } from "./ISeller";

export interface ChatsInterface {
    ID?: number;
    Chat?: string;
    Seller?: SellersInterface;
    SellerID?: number;
    AuctionDetail?: AuctionInterface;
    AuctionDetailID?: number;
    Bidder?: BiddersInterface;
    BidderID?: number;
}

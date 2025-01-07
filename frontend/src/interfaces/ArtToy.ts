import { CategoryInterface } from "./Category";

export interface ArtToysInterface {
    ID?: number;
    Name?: string;
    Brand?: string;
    Description?: string;
    Material?: string;
    Size?: string;
    Picture?: string;
    Category?: CategoryInterface;
    CategoryID?: number;
    SellerID?: number;
}

import { CategoryInterface } from "./Category";

export interface ArtToysInterface {
    id?: number;
    name?: string;
    brand?: string;
    description?: string;
    material?: string;
    size?: string;
    picture?: string;
    category?: CategoryInterface;
    categoryID?: number;
    sellerID?: number;
}

import { ProductView } from "@/features/product";


export default async function ProductPage({ params }) {
    return <>

        <ProductView params={(await params).slug} />
    
    </>;
}

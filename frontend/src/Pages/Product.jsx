import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'; // ✅ THIS LINE IS MANDATORY
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts'; // ✅ THIS LINE IS MANDATORY
const Product = () => {
  const { productId } = useParams();
  const { all_product } = useContext(ShopContext);
  const product = all_product.find((e) => e.id === Number(productId));

  return (
    <div>
      
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};

export default Product;

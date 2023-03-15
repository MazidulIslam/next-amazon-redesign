import ProductItem from '@/components/ProductItem';
import data from '@/utils/data';
import Layout from '@/components/Layout';
import db from '@/utils/db';
import Product from '@/models/Product';
import { CART_ADD_ITEM, Store } from '@/utils/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      // if (product.countInStock < quantity) {
      alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: CART_ADD_ITEM, payload: { ...product, quantity } });
    // router.push('/cart');
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <Carousel showThumbs={false} autoPlay>
        {featuredProducts.map((product) => (
          <div key={product._id}>
            <Link href={`/product/${product.slug}`} passHref className="flex">
              <Image
                src={product.banner}
                alt={product.name}
                width={100}
                height={100}
              />
            </Link>
          </div>
        ))}
      </Carousel>
      <h2 className="h2 my-4">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((product) => {
          return (
            <ProductItem
              addToCartHandler={addToCartHandler}
              product={product}
              key={product.slug}
            ></ProductItem>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}

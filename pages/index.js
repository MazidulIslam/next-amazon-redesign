import ProductItem from '@/components/ProductItem';
import data from '@/utils/data';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data.products?.map((product) => {
          return (
            <ProductItem product={product} key={product.slug}></ProductItem>
          );
        })}
      </div>
    </Layout>
  );
}

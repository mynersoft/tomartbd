import React from 'react';
import { Row, Col, Spin, Empty, Button } from 'antd';
import { useBOGOProducts } from '@/hooks/useBOGOProducts';
import BOGOProductCard from './BOGOProductCard';
import { RefreshCcw } from 'lucide-react';

const BOGOProductsGrid = () => {
  const { data: products, isLoading, isError, refetch } = useBOGOProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !products?.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <span>
            No BOGO products available
            <br />
            <Button
              type="link"
              icon={<RefreshCcw />}
              onClick={() => refetch()}
              className="mt-2"
            >
              Try Again
            </Button>
          </span>
        }
      />
    );
  }

  return (
    <div className="bogo-products-section">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Buy 1 Get 1 Free Deals
        </h2>
        <p className="text-gray-600">
          Special offers where you get more for less
        </p>
      </div>

      <Row gutter={[16, 24]}>
        {products.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <BOGOProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BOGOProductsGrid;

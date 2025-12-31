import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "product-api/tripx-product-api",
    },
    {
          type: "doc",
          id: "product-api/list-products",
          label: "GET /products",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "product-api/create-product",
          label: "POST /products",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "product-api/get-product",
          label: "GET /products/{productId}",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "product-api/update-product",
          label: "PUT /products/{productId}",
          className: "api-method put",
        },
  ],
};

export default sidebar.apisidebar;

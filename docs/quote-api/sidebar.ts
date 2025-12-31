import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "quote-api/tripx-quote-api",
    },
    {
          type: "doc",
          id: "quote-api/list-quotes",
          label: "GET /quotes",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "quote-api/create-quote",
          label: "POST /quotes",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "quote-api/get-quote",
          label: "GET /quotes/{quoteId}",
          className: "api-method get",
        },
  ],
};

export default sidebar.apisidebar;

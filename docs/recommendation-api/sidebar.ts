import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "recommendation-api/tripx-recommendation-api",
    },
    {
          type: "doc",
          id: "recommendation-api/get-recommendations",
          label: "GET /recommendations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "recommendation-api/generate-recommendations",
          label: "POST /recommendations",
          className: "api-method post",
        },
  ],
};

export default sidebar.apisidebar;

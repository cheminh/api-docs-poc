import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "policy-api/tripx-policy-api",
    },
    {
          type: "doc",
          id: "policy-api/list-policies",
          label: "GET /policies",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "policy-api/create-policy",
          label: "POST /policies",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "policy-api/get-policy",
          label: "GET /policies/{policyId}",
          className: "api-method get",
        },
  ],
};

export default sidebar.apisidebar;

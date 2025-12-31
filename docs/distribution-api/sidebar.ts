import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "distribution-api/distribution-api",
    },
    {
          type: "doc",
          id: "distribution-api/distribution-controller-find-one",
          label: "GET /agents",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "distribution-api/distribution-controller-activate-profile",
          label: "PATCH /activateProfile",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "distribution-api/health-controller-get-health",
          label: "GET /health",
          className: "api-method get",
        },
  ],
};

export default sidebar.apisidebar;

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import distributionApiSidebar from "./docs/distribution-api/sidebar";
import policyApiSidebar from "./docs/policy-api/sidebar";
import quoteApiSidebar from "./docs/quote-api/sidebar";
import recommendationApiSidebar from "./docs/recommendation-api/sidebar";
import productApiSidebar from "./docs/product-api/sidebar";

const sidebars: SidebarsConfig = {
	tutorialSidebar: ["intro", "getting-started"],

	// Distribution API
	distributionApiSidebar,

	// Policy API
	policyApiSidebar,

	// Quote API
	quoteApiSidebar,

	// Recommendation API
	recommendationApiSidebar,

	// Product API
	productApiSidebar,
};

export default sidebars;

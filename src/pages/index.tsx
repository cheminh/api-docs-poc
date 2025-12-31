import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<h1 className="hero__title">{siteConfig.title}</h1>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className={styles.buttons}>
					<Link
						className="button button--secondary button--lg"
						to="/docs/intro"
					>
						Documentation
					</Link>
					<Link
						className="button button--outline button--lg"
						to="/docs/api"
						style={{ marginLeft: "1rem" }}
					>
						API Reference
					</Link>
				</div>
			</div>
		</header>
	);
}

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`${siteConfig.title}`}
			description="Build amazing travel experiences with TripX API"
		>
			<HomepageHeader />
			<main>
				<section className={styles.features}>
					<div className="container">
						<div className="row">
							<div className="col col--4">
								<div className="text--center padding-horiz--md">
									<div className={styles.featureIcon}>📚</div>
									<h3>Interactive API Reference</h3>
									<p>
										Explore endpoints with live examples and try them directly
										from the docs.
									</p>
								</div>
							</div>
							<div className="col col--4">
								<div className="text--center padding-horiz--md">
									<div className={styles.featureIcon}>🔒</div>
									<h3>Secure & Reliable</h3>
									<p>Enterprise-grade security with 99.9% uptime guarantee.</p>
								</div>
							</div>
							<div className="col col--4">
								<div className="text--center padding-horiz--md">
									<div className={styles.featureIcon}>⚡</div>
									<h3>Fast Integration</h3>
									<p>
										RESTful design with clear documentation gets you started
										quickly.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
}

import { Suspense } from "react";
import { getProjects } from "../admin/studio/actions";
import ClientPortfolio from "./ClientPortfolio";
import PortfolioSkeleton from "./PortfolioSkeleton";

// 1. THIS RUNS IN THE BACKGROUND
async function ProjectDataFetcher() {
  const projects = await getProjects();
  return <ClientPortfolio initialProjects={projects as any} />;
}

// 2. THIS LOADS INSTANTLY ON CLICK
export default function PortfolioPage() {
  return (
    // Shows the skeleton instantly, swaps to real data when the DB wakes up
    <Suspense fallback={<PortfolioSkeleton />}>
      <ProjectDataFetcher />
    </Suspense>
  );
}
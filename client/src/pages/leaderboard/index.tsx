import LeaderboardList from "@/components/ui/Leaderboard/leaderboard-list";
import type { NextPageWithLayout } from "@/pages/_app";

/**
 * The `LeaderboardsPage` component is the page that displays the leaderboard list.
 * It renders the `LeaderboardList` component, which shows the list of leaderboards.
 */
const LeaderboardsPage: NextPageWithLayout = () => {
  return <LeaderboardList />;
};

export default LeaderboardsPage;

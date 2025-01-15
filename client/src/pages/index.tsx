import { useState } from "react";

import { LoginModal } from "@/components/ui/user/login-modal";
import { usePings } from "@/hooks/pings";

import Layout from "../components/layout";
import { Button } from "../components/ui/button";

const Home = () => {
  const [clicked, setClicked] = useState(false);
  const { data, isLoading } = usePings({
    enabled: clicked,
  });

  return (
    <main className="font-urbanist flex min-h-screen flex-col items-center gap-4 p-24">
      <h1>Test title</h1>
      <h2>Test title</h2>
      <h3>Test title</h3>
      <h4>Test title</h4>
      <h5>Test title</h5>
      <h6>Test title</h6>
      <Button onClick={() => setClicked(true)}>
        {isLoading ? "Loading" : "Ping"}
      </Button>
      <p>
        Response from server: <span>{data as string}</span>
      </p>
    </main>
  );
};

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;

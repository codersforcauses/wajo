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
    <main className="font-urbanist flex min-h-screen flex-col items-center gap-4">
      <div
        className="flex h-96 w-full flex-col items-center justify-between pb-16 pt-36"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 59%, rgba(224,224,224,1) 100%)",
        }}
      >
        <h3>WAJO Olympiads will be back next year!</h3>
        <Button>Start Quiz</Button>
      </div>
      <div className="flex flex-col items-center gap-4 px-32">
        <h4>What is WAJO and what are the Olympiads?</h4>
        <div className="body-2">
          Western Australian Junior mathematics Olympiad is an annual
          competition held within WA to help identity and celebrate the
          brightest mathematical minds amongst our youth. The competition is
          open to high school students in years 7, 8 and 9 (Occasionally, a
          younger exceptional student may arise, who you may wish to
          participate; find out more here). The Olympiad consists of 2 parts: 1)
          The individual paper which will be held on this website and 2) a team
          paper, held in person.
        </div>
      </div>
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

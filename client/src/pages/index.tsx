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
        <Button>
          <p className="body-1">Start Quiz</p>
        </Button>
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

      <div className="mx-10 flex flex-col items-center gap-4 rounded-3xl border bg-background1 p-10">
        <h1>Updates</h1>
        <div className="body-2">
          WAJO is over for 2024, but we'll be back again in 2025, with similar
          dates to below! 2024 format: combination of online and paper-based
          formats. Confirmed Dates: Individual paper: Tuesday, 15 October, 2024
          for 100 minutes starting between 2:30pm and 4pm, online at your school
          Team paper: Saturday, 19 October, 2024 for 50 minutes. Registration at
          9:00am. Prize Ceremony finishes 12:30pm. At two venues: Perth: UWA, in
          Arts Building centred around Alexander Lecture Theatre (Search for:
          Alex). Bunbury: Building 6, Edith Cowan University – Bunbury Campus
          (Grid Reference: E4), 585 Robertson Drive, Bunbury WA 6230. You need:
          Pens, pencils, and if you wish, ruler and compass. Special conditions:
          No calculators. Brains only. Prize Ceremony (Perth): Date: Saturday,
          19 October 2024 Time: 11:30am – 12:30pm Venue: Social Sciences Lecture
          Theatre, near Hackett Entrance No. 1 (see campus map - in SEARCH
          enter: Social Sciences Lecture T One selection will come up. Click on
          it, and a balloon will highlight its location below Car park 3, a good
          place to park.) Future news to come, In the meantime, feel free to
          look at past papers and try a practice test here!
        </div>
        <Button>
          <p className="body-1">Start Practice</p>
        </Button>
      </div>
      <div>
        <h1>Major Prizes </h1>
        <ul>
          <li>UWA Mathematics & Statistics Prize – Best Year 9 student</li>
          <li>MAWA "Jack Bana Award" – Best Year 9 team</li>
          <li>Curtin Mathematics & Statistics Prize – Best Year 8 student</li>
          <li>ECU "David McDougall Award" – Best Year 8 team</li>
          <li>
            Department of Education Gifted & Talented Awards – Top public school
            individual & team
          </li>
          <li>
            Awards of Excellence – Sponsored by New Edition Bookshop, Data
            Analysis Australia, Murdoch University, Dept. of Education, and
            Optiver
          </li>
        </ul>
      </div>
      <div className="mx-10 flex flex-col items-center gap-4 rounded-3xl border bg-background1 p-10">
        Prizes also include second and third place awards in the first four
        categories, plus numerous merit prizes. See our awards section for
        details and past winners.
      </div>
      <h1>Test title</h1>
      <h2>Test title</h2>
      <h3>Test title</h3>
      <h4>Test title</h4>
      <h5>Test title</h5>
      <h6>Test title</h6>
      <p className="body-1">body-1</p>
      <p className="body-2">body-2</p>

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

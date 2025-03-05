import { useRouter } from "next/router";

import { PublicPage } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Sponsor from "@/components/ui/sponsor";

export default function PageConfig() {
  return (
    <PublicPage>
      <HomePage />
    </PublicPage>
  );
}

function HomePage() {
  const router = useRouter();

  return (
    <main className="font-urbanist flex min-h-screen flex-col items-center gap-10">
      <div
        className="flex w-full flex-col items-center justify-between gap-10 pb-16 pt-36 text-center"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 59%, rgba(224,224,224,1) 100%)",
        }}
      >
        {/* <h1>WAJO Olympiads will be back in the coming!</h1> */}
        <h1>Western Australian Juniour mathematics</h1>
        <Button variant="inactive" onClick={() => router.push("/quiz")}>
          {" "}
          {/* the url needs to be changed */}
          <p className="body-1 px-10">Start Quiz</p>
        </Button>
      </div>
      <div className="flex w-8/12 flex-col items-center gap-4 text-center">
        <h4>What is WAJO and what are the Olympiads?</h4>
        <div className="body-2">
          The Western Australian Junior Mathematics Olympiad is an annual
          competition celebrating top young mathematicians. Open to students in
          Years 7-9, it consists of two parts: an online individual paper and an
          in-person team paper.
        </div>
      </div>

      <div className="mx-10 flex flex-col items-center gap-8 rounded-3xl border bg-background1 p-8 lg:w-3/4">
        <h1>Updates</h1>
        <div className="body-2 flex flex-col gap-4">
          <div className="body-2-bold px-4">
            WAJO is over for 2024, but we'll be back again in 2025, with similar
            dates to below!{" "}
          </div>
          <div>
            <p className="body-2-bold inline-block">2024 format:</p> combination
            of online and paper-based formats.{" "}
            <p className="body-2-bold">Confirmed Dates:</p>
            <ul className="list-inside list-disc">
              {" "}
              <li>
                Individual paper:{" "}
                <p className="body-2-bold inline-block">
                  Tuesday, 15 October, 2024 for 100 minutes starting between
                  2:30pm and 4pm, online at your school
                </p>
              </li>{" "}
              <li>
                Team paper:{" "}
                <p className="body-2-bold inline-block">
                  Saturday, 19 October, 2024 for 50 minutes. Registration at
                  9:00am. Prize Ceremony finishes 12:30pm.
                </p>
              </li>
            </ul>
          </div>
          <div>
            <p className="body-2-bold">At two venues:</p>
            <ul className="list-inside list-disc">
              {" "}
              <li>
                <p className="body-2-bold inline-block">Perth:</p> UWA, in Arts
                Building centred around Alexander Lecture Theatre (Search for:
                Alex).
              </li>
              <li>
                {" "}
                <p className="body-2-bold inline-block">Bunbury:</p> Building 6,
                Edith Cowan University – Bunbury Campus (Grid Reference: E4),
                585 Robertson Drive, Bunbury WA 6230.
              </li>
            </ul>
            <p className="body-2-bold inline-block">You need:</p> Pens, pencils,
            and if you wish, ruler and compass. Special
            <p className="body-2-bold inline-block">
              conditions:
            </p> No calculators. Brains only.
          </div>
          <div>
            {" "}
            <p className="body-2-bold">Prize Ceremony (Perth):</p>
            <ul className="list-inside list-disc">
              <li>
                Date:{" "}
                <p className="body-2-bold inline-block">
                  Saturday, 19 October 2024
                </p>
              </li>
              <li>
                {" "}
                Time:{" "}
                <p className="body-2-bold inline-block">11:30am – 12:30pm</p>
              </li>
              <li>
                {" "}
                Venue:{" "}
                <p className="body-2-bold inline-block">
                  Social Sciences Lecture Theatre, near Hackett Entrance No. 1{" "}
                </p>
                (see campus map - in SEARCH enter: Social Sciences Lecture T One
                selection will come up. Click on it, and a balloon will
                highlight its location below Car park 3, a good place to park.)
              </li>
            </ul>
          </div>
          <div>
            Future news to come, In the meantime, feel free to look at past
            papers and try a practice test here!
          </div>
        </div>
        <Button onClick={() => router.push("/practice")}>
          <p className="body-1 px-10">Start Practice</p>
        </Button>
      </div>
      <div className="m-4 flex flex-col items-center gap-8 text-center md:w-3/4 lg:w-1/2">
        <h1>🏅 Major Prizes 🏆</h1>
        <ul className="list-inside list-disc">
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
      <div className="mx-10 flex flex-col items-center gap-4 rounded-3xl border bg-background1 p-8 text-center lg:w-3/4">
        Prizes also include second and third place awards in the first four
        categories, plus numerous merit prizes. See our awards section for
        details and past winners.
      </div>
      <div className="border-y-2 border-grey">
        <h4 className="flex h-20 items-center justify-center">Our sponsors</h4>
        <div className="my-4">
          <Sponsor />
        </div>
      </div>
    </main>
  );
}

import HorizontalCard from "@/components/ui/horizontal-card";

import { NextPageWithLayout } from "../_app";

/**
 * The `QuizPage` component is the page that displays the lists of all quizzes admins have published.
 * It renders the `HorizontalCard` component, which shows the list of quizzes.
 * The list of quizzes are fetched from the database as an array of JSONs.
 * Each quiz is one of three categories: upcoming competition, past questions and solutions, and practice tests.
 */
const QuizPage: NextPageWithLayout = () => {
  let competitionStart = "00 Month 2025 14:00";
  // mock data
  let quizzes = [
    {
      title: "2025 Competition",
      id: "1",
      startTime: "03 June 2025 14:00",
      type: "competition",
    },
    {
      title: "2024 Competition",
      id: "2",
      startTime: "03 June 2024 14:00",
      type: "pastpaper",
    },
    {
      title: "2023 Competition",
      id: "3",
      startTime: "03 June 2024 14:00",
      type: "pastpaper",
    },
    {
      title: "2022 Competition",
      id: "4",
      startTime: "03 June 2024 14:00",
      type: "pastpaper",
    },
    {
      title: "2024 Practice Quiz 1",
      id: "5",
      startTime: "N/A",
      type: "practice",
    },
  ];

  let upcomingCompetitions = quizzes.filter(
    (quiz) => quiz.type === "competition",
  );
  let pastPapers = quizzes.filter((quiz) => quiz.type === "pastpaper");
  let practiceTests = quizzes.filter((quiz) => quiz.type === "practice");
  return (
    <div className="justify-centre mt-8 flex h-full w-full flex-col items-center border border-red-500 bg-white text-center">
      <section className="mt-4 flex min-h-28 w-full flex-col items-center justify-center border border-blue-500 bg-[#FFD659] p-4">
        <h2>Upcoming Competition</h2>
        <h6 className="my-4">Competition will start at {competitionStart}</h6>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {upcomingCompetitions.map((quiz) => (
            <HorizontalCard
              title={quiz.title}
              href={`quiz/competition/${quiz.id}`}
            />
          ))}
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center border border-blue-500 p-4">
        <h2 className="mb-4">Past Questions and Solutions</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {pastPapers.map((quiz) => (
            <HorizontalCard
              title={quiz.title}
              href={`quiz/pastpaper/${quiz.id}`}
            />
          ))}
        </div>
      </section>
      <section className="mb-2 flex w-full flex-col items-center justify-center border border-blue-500 p-4">
        <h2 className="mb-4">Practice Tests</h2>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          {practiceTests.map((quiz) => (
            <HorizontalCard
              title={quiz.title}
              href={`quiz/practice/${quiz.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizPage;

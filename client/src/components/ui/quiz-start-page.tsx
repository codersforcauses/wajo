import { Button } from "@/components/ui/button";

export default function GenericQuiz() {
  let headingStyle = `text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold`;
  let generalInstructions = "Answer all questions";
  let competitionName = "Maths Competition";
  let startTime = "02 November 2025 14:00";
  let quizDuration = "100 minutes";
  return (
    <div className="flex w-full items-center justify-center border-2 border-green-600">
      <div className="min-h-64 w-3/4 rounded-lg border-8 border-[#FFE8A3] p-10">
        <h2 className={headingStyle}>{competitionName}</h2>
        <h5 className="my-4">Competition will start at {startTime}</h5>
        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>Individual Quiz</h2>
          <h2 className={headingStyle}>[{quizDuration}]</h2>
        </div>
        <p>{generalInstructions}</p>
        <div className="h-4 w-full border border-slate-800"></div>
        <Button size="lg" onClick={() => {}}>
          Start
        </Button>
      </div>
    </div>
  );
}

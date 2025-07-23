import { Button } from "@/components/ui/button";
import DateTimeDisplay from "@/components/ui/date-format";

interface Props {
  onStart: () => void;
  quizName: string;
  startTime: string | Date;
  timeWindow: number;
  quizDuration: number;
  numberOfQuestions: number;
  isFinished: boolean;
  isEntryClosed: boolean;
  isSubmitted: boolean;
}

export default function QuizIntro({
  onStart,
  quizName,
  startTime,
  timeWindow,
  quizDuration,
  numberOfQuestions,
  isFinished,
  isEntryClosed,
  isSubmitted,
}: Partial<Props>) {
  let headingStyle = `text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold`;
  let generalInstructions =
    '<span class="font-bold">General instructions:</span> There are 16 questions. Each question has an answer that is a positive integer less than 1000. Calculators are <span class="font-bold">not</span> permitted. Diagrams are provided to clarify wording only, and should <span class="font-bold">not</span> be expected to be to scale.';
  // let competitionName = "Maths Competition";
  // let startTime = "02 November 2025 14:00";
  // let quizDuration = 100;
  // let numberOfQuestions = 16;
  return (
    <div className="flex w-full items-center justify-center">
      <div className="min-h-64 w-3/4 rounded-lg border-8 border-[#FFE8A3] bg-[#FFE8A3] p-10">
        <h2 className={headingStyle}>{quizName}</h2>
        <div className="my-4 flex gap-2">
          Competition will start at{" "}
          <DateTimeDisplay
            date={startTime}
            className="flex-row gap-1 font-bold"
          />
        </div>
        <div className="my-4 flex gap-2">
          Competition will allow entering within {timeWindow} minutes
        </div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>Individual Quiz</h2>
          <h2 className={headingStyle}>{quizDuration} minutes</h2>
        </div>
        {/* <p>{generalInstructions}</p> */}
        {/* <p dangerouslySetInnerHTML={{ __html: generalInstructions }}></p> */}
        <p>
          <span className="font-bold">General instructions:</span> Each question
          has an answer that is a positive integer less than 1000. Calculators
          are <span className="font-bold"> not </span>
          permitted. Diagrams are provided to clarify wording only, and should
          <span className="font-bold"> not </span> be expected to be to scale.
        </p>
        <div className="h-4 w-full"></div>
        {isFinished ? (
          <Button size="lg" variant={"inactive"}>
            Competition has finished
          </Button>
        ) : isEntryClosed ? (
          <Button size="lg" variant={"inactive"}>
            Entries for the competition are now closed
          </Button>
        ) : isSubmitted ? (
          <Button size="lg" variant={"inactive"}>
            You have submitted your answer
          </Button>
        ) : (
          <Button size="lg" onClick={onStart}>
            Start
          </Button>
        )}
      </div>
    </div>
  );
}

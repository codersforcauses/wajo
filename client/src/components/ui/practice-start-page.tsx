import { Button } from "@/components/ui/button";

interface Props {
  onStart: () => void;
  PracticeName?: string;
  numberOfQuestions: number;
}

export default function PracticeStartPage({
  onStart,
  PracticeName,
  numberOfQuestions,
}: Props) {
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
        <h2>{PracticeName}</h2>

        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>WAJO Practice</h2>
        </div>
        {/* <p>{generalInstructions}</p> */}
        {/* <p dangerouslySetInnerHTML={{ __html: generalInstructions }}></p> */}
        <p>
          <span className="font-bold">General instructions:</span> There are{" "}
          {numberOfQuestions} questions. Each question has an answer that is a
          positive integer less than 1000. Calculators are{" "}
          <span className="font-bold"> not </span>
          permitted. Diagrams are provided to clarify wording only, and should
          <span className="font-bold"> not </span> be expected to be to scale.
        </p>
        <div className="h-4 w-full"></div>
        <Button className="w-full" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}

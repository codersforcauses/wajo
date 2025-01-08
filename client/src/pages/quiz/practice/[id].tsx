import GenericQuiz from "@/components/ui/generic-quiz";

export default function PracticeQuizPage() {
  // this value will be fetched from the database
  let practiceName = "Practice Quiz";
  return (
    <div className="flex min-h-dvh w-full items-center justify-center border-2 border-orange-600">
      <h1>{practiceName}</h1>
      <GenericQuiz />
    </div>
  );
}

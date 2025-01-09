import GenericQuiz from "@/components/ui/generic-quiz";

export default function PracticeQuizPage() {
  // this value will be fetched from the database
  let practiceName = "Practice Quiz";
  return (
    <div className="border-2 border-orange-600">
      <h1 className="my-4 text-center">{practiceName}</h1>
      <GenericQuiz />
    </div>
  );
}

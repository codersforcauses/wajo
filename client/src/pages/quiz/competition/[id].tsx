import GenericQuiz from "@/components/ui/generic-quiz";

export default function CompetitionQuizPage() {
  // this value will be fetched from the database
  let competitionName = "Maths Competition";
  return (
    <div className="flex min-h-dvh w-full items-center justify-center border-2 border-orange-600">
      <h1>{competitionName}</h1>
      <GenericQuiz />
    </div>
  );
}

import GenericQuiz from "@/components/ui/generic-quiz";

export default function CompetitionQuizPage() {
  // this value will be fetched from the database
  let competitionName = "Maths Competition";
  return (
    <div className="border-2 border-orange-600">
      <h1 className="my-4 text-center">{competitionName}</h1>
      <GenericQuiz />
    </div>
  );
}

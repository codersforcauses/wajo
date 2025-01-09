import { Button } from "@/components/ui/button";

export default function GenericQuiz() {
  let headingStyle = `text-xl sm:text-2xl md:text-3xl text-slate-800 font-bold`;
  // these values will be fetched from the database
  let questionNumber = 1;
  let marks = 2;
  let question =
    "After 15 women leave a party, there are 3 times as many men as women. Later 40 men leave, so that then 7 times as many women as men remain. How many women were there at the start of the party?";
  let mathJax = "";

  function onSave() {
    // save the answer
    console.log("Answer saved");
  }

  return (
    <div className="flex w-full items-center justify-center border-2 border-green-600">
      <div className="min-h-64 w-3/4 rounded-lg border-8 border-[#FFE8A3] p-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className={headingStyle}>Question {questionNumber}</h2>
          {marks === 1 ? (
            <h2 className={headingStyle}>[{marks} Mark]</h2>
          ) : (
            <h2 className={headingStyle}>[{marks} Marks]</h2>
          )}
        </div>
        <p>{question}</p>
        <p className="mb-6 mt-4">{mathJax}</p>
        <div className="mt-6 flex flex-col items-center justify-center">
          <h3 className="mt-8 text-lg text-slate-800 sm:text-xl md:text-2xl">
            Your Answer
          </h3>
          <p className="text-slate-700">Must be an integer from 1-999</p>
          <input
            type="text"
            placeholder="Please input your answer"
            className="mt-4 h-10 min-w-64 rounded-sm border border-slate-500 px-2"
          />
          <br />
          <Button size="lg" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

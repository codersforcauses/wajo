import axios from "axios";
import { useEffect, useState } from "react";

const RetrieveQuestion = () => {
  const [isLoading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/quiz/competition/3/slots/?format=json",
        );
        setQuestions(response.data);
        console.log(response.data); // Just for debuging
      } catch (err) {
        setError("Failed to fetch question.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, []);

  return (
    <>
      <div>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {questions && (
          <ul>
            {questions.map((q, index) => (
              <li key={index}>
                Question {index + 1} : {q?.question?.question_text} Correct
                Answer:
                {q?.question?.answer_text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default RetrieveQuestion;

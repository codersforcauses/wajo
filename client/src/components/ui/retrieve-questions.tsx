import axios from "axios";
import { useEffect, useState } from "react";

const RetrieveQuestion = () => {
  const [isLoading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/quiz/all_quizzes/2/slots/?format=json",
        );
        setQuestion(response.data);
        // console.log(response);
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
        {question && <p>{question}</p>}
      </div>
    </>
  );
};

export default RetrieveQuestion;

import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch questions when the app component mounts
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, []);

  const addQuestion = (newQuestion) => {
    // Create a new question
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((response) => response.json())
      .then((createdQuestion) => {
        setQuestions([...questions, createdQuestion]);
        setPage("List");
      });
  };

  const deleteQuestion = (questionId) => {
    // Delete a question
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedQuestions = questions.filter((q) => q.id !== questionId);
        setQuestions(updatedQuestions);
      });
  };

  const updateQuestion = (questionId, correctIndex) => {
    // Update the correct answer for a question
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex }),
    })
      .then(() => {
        const updatedQuestions = questions.map((q) => {
          if (q.id === questionId) {
            q.correctIndex = correctIndex;
          }
          return q;
        });
        setQuestions(updatedQuestions);
      });
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={addQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={deleteQuestion}
          onUpdateQuestion={updateQuestion}
          loading={loading}
        />
      )}
    </main>
  );
}

export default App;

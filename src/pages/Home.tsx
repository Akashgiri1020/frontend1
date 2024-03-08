import { json } from "body-parser";
import React, { useEffect, useState } from "react";

interface TasksData {
  _id: string;
  createdAt: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<TasksData[]>();

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/tasks")
      .then((res) => res.json())
      .then((res) => {
        setTasks(res.data)
        console.log(res.data);
        
    });
  }, []);

  const handleMarking = (id: string) => {
    fetch(`http://localhost:8000/api/v1/tasks/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json', // Add or adjust this line
      },
      body:JSON.stringify(
        {isCompleted: true}
        ),
    })
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setTasks((prevTask) => {
          return prevTask?.map((task) =>
            task._id === id ? { ...task, isCompleted: true } : task
          );
        });
      });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-xl text-green-500 text-center p-6">
        Task Management System
      </h1>
      <div className="w-1/2 h-auto border-2 p-6">
        <div>
          {/* section-1 */}
          <h1 className="text-lg text-center">Pending Tasks</h1>
          {tasks?.some((item) => !item.isCompleted) ? (
          tasks.map((item) =>
            !item.isCompleted ? (
              <div
                key={item._id}
                className="w-full h-auto border-2 rounded-md border-red-300 bg-orange-500 p-2"
              >
                <h1 className="text-xl text-white font-bold">
                  {item.title.toUpperCase()}
                </h1>
                <p className="text-md text-slate-800 font-medium">
                  {item.description}
                </p>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md font-medium text-white">
                    {item.createdAt}
                  </p>
                  <button
                    className="w-auto h-10 p-2 rounded-md bg-red-500 text-white"
                    onClick={() => handleMarking(item._id)}
                  >
                    Mark as Completed
                  </button>
                  <button className="w-auto h-10 p-2 rounded-md bg-red-800 text-white">
                    Delete Task
                  </button>
                </div>
              </div>
            ) : null
          )
        ) : (
          <h1>There are no pending tasks available.</h1>
        )}
        </div>
        <div>
          {/* section-2 */}
          <h1 className="text-lg text-center">Completed Tasks</h1>
          {tasks?.some((item) => item.isCompleted) ? (
          tasks.map((item) =>
            item.isCompleted ? (
                <div
                  key={item._id}
                  className="w-full h-auto border-2 rounded-md border-red-300 bg-green-700 p-2"
                >
                  <h1 className="text-xl text-white font-bold">
                    {item.title.toUpperCase()}
                  </h1>
                  <p className="text-md text-slate-800 font-medium">
                    {item.description}
                  </p>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-md font-medium text-white">
                      {item.createdAt}
                    </p>
                    {/* <button className='w-auto h-10 p-2 rounded-md bg-red-800 text-white'>Mark as Completed</button> */}
                  </div>
                </div>
              ) :(
                <h1>this is run</h1>
              )
              )
            ) : (
              <h1>There are no pending tasks available.</h1>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;


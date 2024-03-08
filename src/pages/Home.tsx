import { json } from "body-parser";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

interface TasksData {
  _id: string;
  createdAt: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<TasksData[]>();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getTasks = () => {
      try {
        fetch("http://localhost:8000/api/v1/tasks")
          .then((res) => res.json())
          .then((res) => {
            setTasks(res.data);
            console.log(res.data);
          });
      } catch (error) {
        console.error("Error Recieved while Connection with Backend ", error);
      }
    };
    getTasks();
  }, []);

  const handleMarking = (id: string) => {
    try {
      fetch(`http://localhost:8000/api/v1/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Add or adjust this line
        },
        body: JSON.stringify({ isCompleted: true }),
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
    } catch (error) {
      console.error('Error While Updating Task ',error)
    }
  };

  const handleAddTask = async() =>{
    try {
      await fetch('http://localhost:8000/api/v1/tasks',{
        method:'POST',
        headers: {
          "Content-Type": "application/json", // Add or adjust this line
        },
        body:JSON.stringify({
          title:title,
          description:description,
          isCompleted:false
        })

      })
      .then(res=>res.json())
      .then(res=>{
        tasks?.push(res.data)
        setShowModal(false)
      })
    } catch (error) {
      console.error('Error While Adding New Task ',error)
    }
  }

  const handleDeleteTask = async (taskID:string) =>{
    try {
      await fetch(`http://localhost:8000/api/v1/tasks/${taskID}`,{
        method:'DELETE',
        headers:{
          "Content-Type": "application/json",
        },
      })
      .then(res=>res.json())
      .then(res=>{
        const updatedArray = tasks?.filter(task=>task._id !== taskID)
        setTasks(updatedArray)
      })
    } catch (error) {
      console.error('error recieve while deleting task' ,error)
    }
  }

  return (
    <div>
      <div
        className={`flex flex-col justify-center items-center ${
          showModal ? "opacity-10" : ""
        }`}
      >
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
                    className="w-full h-auto border-2 rounded-md border-red-300 bg-orange-500 p-2 mb-2 mt-2"
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
                      <button className="w-auto h-10 p-2 rounded-md bg-red-800 text-white" onClick={()=>handleDeleteTask(item._id)}>
                        Delete Task
                      </button>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <h1>There are no pending tasks available.</h1>
            )}
            <div className="items-center flex justify-center">
              <button
                className="w-auto h-10 p-2 rounded-md bg-cyan-400 text-white"
                onClick={() => setShowModal(true)}
              >
                Add More
              </button>
            </div>
          </div>
          <div>
            {/* section-2 */}
            <h1 className="text-lg text-center">Completed Tasks</h1>
            {tasks?.some((item) => item.isCompleted) ? (
              tasks.map((item) =>
                item.isCompleted ? (
                  <div
                    key={item._id}
                    className="w-full h-auto border-2 rounded-md border-red-300 bg-green-700 p-2 mb-2 mt-2" 
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
                      <button className="w-auto h-10 p-2 rounded-md bg-red-800 text-white" onClick={()=>handleDeleteTask(item._id)}>
                        Delete Task
                      </button>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <h1>There are no completed tasks available.</h1>
            )}
          </div>
        </div>
      </div>

      {/* Modal COde Start */}

      {showModal && (
        <div className="space-y-5 bg-slate-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 p-6">
          <div className=" flex justify-end">
            <button onClick={() => setShowModal(false)}>
              <RxCross2 color="white" size={28} />
            </button>
          </div>
          <div className="p-3 rounded-lg">
            <div className="mb-4">
              <input
                type="text"
                id="title"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Enter Title..."
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="description"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
                placeholder="Enter description..."
                rows={4}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="w-auto h-10 p-2 rounded-md bg-red-800 text-white" onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

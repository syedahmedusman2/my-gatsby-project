import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"
import "./style.css"
import CircularProgress from "@material-ui/core/CircularProgress"

const getTodos = gql`
  {
    allTask {
      id
      text
    }
  }
`
const addTodo = gql`
  mutation addTask($text: String!) {
    addTask(text: $text) {
      text
    }
  }
`
const deleteTodo = gql`
  mutation delTask($id: ID!) {
    delTask(id: $id) {
      text
    }
  }
`

export default function Home() {
  const [todo, setTodo] = useState("")
  const { loading, error, data } = useQuery(getTodos)
  const [deleteTask] = useMutation(deleteTodo)
  const [addTask] = useMutation(addTodo)
  console.log(data)

  if (error) {
    <h4>Error</h4>
  }
  const handleSubmit = event => {
    event.preventDefault()
    addTask({
      variables: {
        text: todo,
      },
      refetchQueries: [{ query: getTodos }],
    })
    setTodo("")
  }

  const handleDelete = event => {
    console.log(JSON.stringify(event.currentTarget.value))
    deleteTask({
      variables: {
        id: event.currentTarget.value,
      },
      refetchQueries: [{ query: getTodos }],
    })
  }
  return (
    <div className="main">
      <div className="head">
        <h3>TODO APP</h3>
      </div>
      <div className="input-main">
        <div className="input-div">
          <input
            type="text"
            placeholder="add task"
            onChange={e => setTodo(e.currentTarget.value)}
            required
            value={todo}
          />
          <button type="submit" onClick={handleSubmit}>
            +
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : data !== undefined || null && data.allTask.length !== 0   ? (
          <div className="data-display">
            <div className="data-div">
              {data.allTask.map((v: { text: React.ReactNode; id: string | number | readonly string[] }, i: React.Key) => (
                <div key={i}>
                  <p>{v.text}</p>
                  <button value={v.id} onClick={handleDelete}>
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-task">
            <h4>No Task for today</h4>
          </div>
        )}
      </div>
    </div>
  )
}








// import React, { useEffect, useState } from "react"
// import { useQuery, useMutation } from '@apollo/client';
// import gql from 'graphql-tag';
// import "./style.css";

// // This query is executed at run time by Apollo.
// const GET_TODOS = gql`
// {
//     todos {
//         task,
//         id,
//         status
//     }
// }
// `;
// const ADD_TODO = gql`
//     mutation addTodo($task: String!){
//         addTodo(task: $task){
//             task
//         }
//     }
// `

// export default function Home() {
//     let inputText;

//     const [addTodo] = useMutation(ADD_TODO);
//     const addTask = () => {
//         addTodo({
//             variables: {
//                 task: inputText.value
//             },
//             refetchQueries: [{ query: GET_TODOS }]
//         })
//         inputText.value = "";
//     }

//     const { loading, error, data } = useQuery(GET_TODOS);

//     if (loading)
//         return <h2>Loading..</h2>

//     if (error) {
//         console.log(error)
//         return <h2>Error</h2>
//     }

//     return (
//         <div className="container">
//             <label>
//                 <h1> Add Task </h1> 
//                 <input type="text" ref={node => {
//                     inputText = node;
//                 }} />
//             </label>
//             <button onClick={addTask}>Add Task</button>

//             <br /> <br />

//             <h3>My TODO LIST</h3>

//             <table>
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th> TASK </th>
//                         <th> STATUS </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.todos.map(todo => {
//                         console.log(todo)
//                         return <tr key={todo.id}>
//                             <td> {todo.id} </td>
//                             <td> {todo.task} </td>
//                             <td> {todo.status.toString()} </td>
//                         </tr>
//                     })}
//                 </tbody>
//             </table>

//         </div>
//     );

// }
const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb")
q = faunadb.query



const typeDefs = gql`
  type Query {
    allTask: [Task]
  }
  type Mutation {
    addTask(text: String): Task
    delTask(id: ID!): Task
  }
  type Task {
    id: ID!
    text: String!
  }
`
const client = new faunadb.Client({
  secret: 'fnAD9BtEOqACDPrc4PD1x4iWp5Yx2vbCBykuACgg',
})

const resolvers = {
  Query: {
    allTask: async () => {
      try {
        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("task"))),
            q.Lambda(x => q.Get(x))
          )
        )
        const data = result.data.map(t => {
          return {
            id: t.ref.id,
            text: t.data.text,
          }
        })
        return data
      } catch (error) {
        console.log(error)
        return error.toString()
      }
    },
  },

  Mutation: {
    addTask: async (_, { text }) => {
      try {
        const result = await client.query(
          q.Create(q.Collection("task"), { data: { text: text } })
        )
        console.log(result.ref.id)
        return result.data
      } catch (error) {
        return error.toString()
      }
    },
    delTask: async (_, { id }) => {
      try {
        const newId = JSON.stringify(id)
        console.log(newId)
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("task"), id))
        )
        return result.data
      } catch (error) {
        return error
      }
    },
  },
}
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()






// const { ApolloServer, gql } = require('apollo-server-lambda')
// var faunadb = require('faunadb'),
//   q = faunadb.query;

// const typeDefs = gql`
//   type Query {
//     todos: [Todo!]
//   }
//   type Mutation {
//     addTodo(task: String!): Todo
//   }
//   type Todo {
//     id: ID!
//     task: String!
//     status: Boolean!
//   }
// `

// const resolvers = {
//   Query: {
//     todos: async (root, args, context) => {
//       try {
//         var adminClient = new faunadb.Client({ secret: 'fnAD9BtEOqACDPrc4PD1x4iWp5Yx2vbCBykuACgg' });
//         const result = await adminClient.query(
//           q.Map(
//             q.Paginate(q.Match(q.Index('task'))),
//             q.Lambda(x => q.Get(x))
//           )
//         )

//         console.log(result.data)

//         return result.data.map(d=>{
//           return {
//             id: d.ts,
//             status: d.data.status,
//             task: d.data.task
//           }
//         })
//       }
//       catch (err) {
//         console.log(err)
//       }
//     }
//     // authorByName: (root, args, context) => {
//     //   console.log('hihhihi', args.name)
//     //   return authors.find(x => x.name === args.name) || 'NOTFOUND'
//     // },
//   },
//   Mutation: {
//     addTodo: async (_, { task }) => {
//       try {
//         var adminClient = new faunadb.Client({ secret: 'fnAD9BtEOqACDPrc4PD1x4iWp5Yx2vbCBykuACgg' });
//         const result = await adminClient.query(
//           q.Create(
//             q.Collection('todos'),
//             {
//               data: {
//                 task: task,
//                 status: true
//               }
//             },
//           )
//         )
//         return result.ref.data;
//       }
//       catch (err) {
//         console.log(err)
//       }
//     }
//   }
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// })

// exports.handler = server.createHandler()











// // const { ApolloServer, gql } = require('apollo-server-lambda')
// // var faunadb = require('faunadb'),
// //   q = faunadb.query;

// // const typeDefs = gql`
// //   type Query {
  
// //     todos: [Todo!]
  
// //   }

// //   type Mutation {
// //     addTodo(task: String!): Todo
// //   }

// //   type Todo {
// //     id: ID!
// //     task: String!
// //     status: Boolean!
// //   }
// // `

// // // const authors = [
// // //   { id: 1, name: 'Terry Pratchett', married: false },
// // //   { id: 2, name: 'Stephen King', married: true },
// // //   { id: 3, name: 'JK Rowling', married: false },
// // // ]

// // const resolvers = {
// //   Query: {
// //     todos: async (root, args, context) => {
// //       // return 'Hello World'
// //       try {
// //         var adminClient = new faunadb.Client({ secret: 'fnAD9BtEOqACDPrc4PD1x4iWp5Yx2vbCBykuACgg' })

// //         const result = await adminClient.query(

// //           q.Map(
// //             q.Paginate(q.Match(q.Index('task'))),
// //             q.Lambda(x => q.Get(x))
// //           )

// //         )
// //         console.log(result)
// //         return [{
// //           task: 'hello',
// //           status: true,
// //           id: 1
// //         }]

// //       }
// //       catch (err) {
// //         console.log(err)
        
// //       }

// //     }

// //     // authorByName: (root, args) => {
// //     //   console.log('hihhihi', args.name)
// //     //   return authors.find((author) => author.name === args.name) || 'NOTFOUND'
// //     // },
// //   },
// //   Mutation: {
// //     addTodo: async (_, { task }) => {
// //       try {
// //         var adminClient = new faunadb.Client({ secret: 'fnAD9BtEOqACDPrc4PD1x4iWp5Yx2vbCBykuACgg' })

// //         const result = await adminClient.query(

// //           q.Create(
// //             q.Collection('todos'),
// //             {
// //               data: {
// //                 task: task,
// //                 status: true

// //               }
// //             }
// //           )

// //         )
// //         console.log
// //         return result.ref.data

// //       }
// //       catch (err) {
// //         console.log(err)
        
// //       }

// //     }

// //   }
// // }


// // const server = new ApolloServer({
// //   typeDefs,
// //   resolvers,
// // })

// // const handler = server.createHandler()

// // module.exports = { handler }

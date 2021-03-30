import { gql } from '@apollo/client'

export const QUERY_TODOLIST = gql`
  query queryTodoList {
    todolistapp {
      description
      end
      id
      start
      title
      allDay
    }
  }
`
export const ADD_TODOLIST = gql`
  mutation addTodoList(
    $description: String
    $end: timestamp
    $start: timestamp
    $title: String
  ) {
    insert_todolistapp(
      objects: {
        description: $description
        end: $end
        start: $start
        title: $title
      }
    ) {
      affected_rows
    }
  }
`
export const DELETE_TODO_LIST = gql`
  mutation deleteTodolist($id: Int) {
    delete_todolistapp(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

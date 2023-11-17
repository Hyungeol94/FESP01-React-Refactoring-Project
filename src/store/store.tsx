import {create} from 'zustand'
import axios from 'axios';
import { types } from 'util';
import { StaticKeyword } from 'typescript';


interface TodoState {
  todoItems: TodoInfoItem[];
  addTodoItem: (item: TodoInfoItem) => void;
  deleteTodoItem: (item: TodoInfoItem) => void;
  registerTodoItem: (item: TodoInfoItem) => void;
  // dispatch: (args: DispatchedActionType) => void;
}

// type State = {
//   todoItems: Array<TodoInfoItem>[]; 
// }

// type Actions = {
//   addTodoItem: (item: TodoInfoItem) => void;
//   deleteTodoItem: (item: TodoInfoItem) => void;
//   registerTodoItem: (item: TodoInfoItem) => void;
// }

type DispatchedActionType = {type: keyof TodoActionTypes, item: TodoInfoItem}

// type Action = {
//   type: keyof Actions,
//   item: TodoInfoItem
// }

type TodoActionTypes = {
  addTodoItem: 'addTodoItem',
  deleteTodoItem: 'deleteTodoItem',
  registerTodoItem: 'registerTodoItem'
}

// enum TodoActionTypes {
//   addTodoItem,
//   deleteTodoItem,
//   registerTodoItem,
// }

// type ToDoAction<T> = T extends keyof typeof TodoActionTypes? T : never;
const todoItemsReducer = (state: TodoState, action: DispatchedActionType) => { // type: keyof typeof types
  switch(action.type){
    case 'addTodoItem':
      return {todoItems : [...state.todoItems, action.item]}

    case 'deleteTodoItem':
      return {todoItems: state.todoItems.filter((todo) => (todo!==action.item))}

    case 'registerTodoItem':
        try {
          const response = axios.post<TodoInfoItem>(
          "http://localhost:33088/api/todolist", 
          action.item,
        ).then((response) => {
          alert("할 일이 등록되었습니다.");
          return {todoItems: [...state.todoItems]}
          //navigate('/') 
      }).catch((error: any) => {
        console.error("Error:", error);
        return {todoItems: [...state.todoItems]}
      })
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Axios error with response
        if (error.response) {
          console.error("Axios Error:", error.response);
        } else {
          console.error("Axios Error: No response received");
        }
        return {todoItems: [...state.todoItems]}
      } else if (error instanceof Error) {
        // Network error or other non-Axios error
        console.error("Error:", error.message);
        return {todoItems: [...state.todoItems]}
      } else {
        // Handle other types of errors
        console.error("Unknown Error:", error);
        return {todoItems: [...state.todoItems]}
      }
    }
        return {
          todoItems: [...state.todoItems]
        }
    default:
      return state
    } 
}



export const useTodoStore = create<TodoState>()((set) => ({
    todoItems : [], //state
    //dispatch: (action: Action) => set((state) => todoItemsReducer(state, action)),
    addTodoItem: (item) => set((state)=>({todoItems : [...state.todoItems, item]})),
    deleteTodoItem: (item) => set((state)=>({todoItems: state.todoItems.filter((todo) => (todo!==item))})),
    registerTodoItem: (item) => set((state) => (todoItemsReducer(state, {type: 'registerTodoItem', item: item} )))
    // registerTodoItem: (item) => set((state) => ({todoItems: reducer(state, { "registerTodoItem", item })})),
  // addTodoItem: (item) => set((state) => reducer(state, { types.addTodoItem, item })),
  // deleteTodoItem: (item) => set((state) => reducer(state, { types.deleteTodoItem, item })),
    
}))




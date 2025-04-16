import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Platform, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { todoData } from "../app/data/todolist";
import React, { useEffect, useState } from "react";

import { Checkbox } from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage';

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem('todos');
        if(todos !== null){
          setTodos(JSON.parse(todos))
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTodos();
  },[])

  const [todos, setTodos] = useState<ToDoType[]>([])

  const [todoText, setTodoText] = useState("");


  const [searchText, setSearchText] = useState("");

  const addTodo = async () => {
    try {
      const newTodo = {
        id: todos.length + 1,
        title: todoText,
        isDone: false,
      };
      const updatedTodos = [...todos, newTodo]; // Create new array with spread operator
      setTodos(updatedTodos); // Update state with new array
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
      setTodoText("");
      Keyboard.dismiss();
    }
    catch (error) {
      console.log(error)
    }

  };

  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos); // Update local state
      await AsyncStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      );
      setTodos(updatedTodos);
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    } catch (error) {
      console.log(error);
    }
  };

  const searchedTodo = todos.filter((todo) => todo.title.toLowerCase().includes(searchText.toLowerCase()));


  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { alert("Clicked") }}><Ionicons name="menu" size={24} color="black" /></TouchableOpacity>
        <TouchableOpacity onPress={() => { alert("Clicked") }}>
          <Image source={{ uri: 'https://reactjs.org/logo-og.png' }} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchbar}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList style={styles.todoList}
        showsVerticalScrollIndicator={false}
        data={[...searchedTodo].reverse()}
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item: todo }) => (
          <TodoCard todo={todo} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />
        )}
      />

      <View style={styles.footer}>
        <TextInput
          style={styles.newTodoInput}
          placeholder="Add a new todo"
          value={todoText}
          onChangeText={setTodoText}
        />
        <TouchableOpacity
          onPress={() => {
            if (todoText.trim().length > 0) {
              addTodo();
              setTodoText(""); // Clear the TextInput field
            }
          }}
        >
          <Ionicons style={styles.addIcon} name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const TodoCard = ({ 
  todo, 
  deleteTodo, 
  toggleTodo 
}: { 
  todo: ToDoType,
  deleteTodo: (id:number) => void,
  toggleTodo: (id:number) => void 
}) => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.todoInfocontainer}>
        <Checkbox 
          value={todo.isDone} 
          onValueChange={() => (toggleTodo(todo.id))}
          color={todo.isDone ? "blue" : undefined} 
        />
        <Text style={[styles.todoText, todo.isDone && { textDecorationLine: "line-through" }]}>
          {todo.title}
        </Text>
      </View>

      <TouchableOpacity onPress={() => { deleteTodo(todo.id), alert("Deleted "+todo.id) }}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  searchbar: {
    marginBottom: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    ...(Platform.OS === 'web' && { outlineStyle: "none" })
  },
  todoContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
    justifyContent: "space-between"
  },
  todoInfocontainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
  },
  newTodoInput: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  addIcon: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10
  },
  todoList: {
    paddingBottom: 40,
  }
});
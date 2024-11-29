import { Button, Flex, Heading, Text, TextField, useAuthenticator, View } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {  
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [notes, setNotes] = useState<Array<Schema["Note"]["type"]>>([]);
  const [formData, setFormData] = useState({
    name: '',content: '',description: ''
  });
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    client.models.Note.observeQuery().subscribe({
      next: (data) => setNotes([...data.items]),
    });
  }, []);

  async function createNote(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    client.models.Note.create(formData);
    setFormData({
      name: '',content: '',description: ''
    });
  }

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteNote(id: string) {
    client.models.Note.delete({ id });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  const changeNote = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>
      <h1>{user?.signInDetails?.loginId}'s notes</h1>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            onChange={changeNote}
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            onChange={changeNote}
            required
          />
          <TextField
            name="content"
            placeholder="Note Content"
            label="Note Content"
            labelHidden
            variation="quiet"
            onChange={changeNote}
            required
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.id || note.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {note.name}
            </Text>
            <Text as="span">{note.content}</Text>
            <Button variation="link" onClick={() => deleteNote(note.id)}>
              Delete note
            </Button>
          </Flex>
        ))}
      </View>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;

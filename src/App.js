import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <TaskList />
    </div>
  );
}

export default App;


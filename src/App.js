import React from "react";
import io from 'socket.io-client';
import uuid from 'uuid';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  };

  socket = '';

  componentDidMount() {
    this.socket = io.connect((process.env.NODE_ENV === 'production') ? process.env.PORT : 'http://localhost:8000');
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (task, emitted) => this.removeTask(task, emitted));
  };

  handleNameChange = (event) => {
    this.setState({ taskName: event.target.value });
  };

  updateTasks = (arrayOfTasks) => {
    console.log('upa')
    this.setState({tasks: arrayOfTasks});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const newId = uuid();
    const newTask = {
      id: newId,
      name: this.state.taskName
    };
    this.setState({taskName: ''});
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
  };

  addTask(task) {
    const updatedArray = [...this.state.tasks];
    updatedArray.push(task);
    this.setState({tasks: updatedArray});
  };

  removeTask = (id, emitted) => {
    const updatedArray = [...this.state.tasks];

    updatedArray.forEach((item, index) => {
      if( item.id === id) {
        updatedArray.splice(index, 1);
      };
    });

    this.setState({tasks: updatedArray});
    if(!emitted) this.socket.emit('removeTask', id);
  };

  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1> 
        </header>

        <section className="tasks-section">
          <h2>The list</h2>

          <ul className="tasks-section__list">
            {this.state.tasks.map(({name, id}) => {
              return (
                  <li key={id} className="task">{name} 
                    <button key={name + 'btn'} onClick={() => this.removeTask(id)} className="btn btn--red" id="btn">Remove</button>
                  </li>
                );
            })}
          </ul>

          <form className="add-task-form" onSubmit={this.handleSubmit}>
            <input 
              className="taskInput" 
              autoComplete="off" 
              type="text" 
              placeholder="type your task" 
              value={this.state.taskName}
              onChange={this.handleNameChange}
            />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };
}

export default App;

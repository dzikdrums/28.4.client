import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  state = {
    tasks: ['buty', 'zakupy'],
    taskName: ''
  };

  
  socket = io({
    autoConnect: false
  });

  componentDidMount() {
    this.socket.connect("localhost:8000");
    // this.socket.on('addTask', (task) => this.addTask(task));
    // this.socket.on('removeTask', (task) => this.removeTask(task));

  };

  handleNameChange = (event) => {
    this.setState({ taskName: event.target.value });
    console.log(this.state.taskName);
  };

  updateTasks = (arrayOfTasks) => {
    this.setState({tasks: arrayOfTasks})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.addTask(this.state.taskName);
    // this.socket.emit('addTask', this.state.taskName);
  };

  addTask(task) {
    const updatedArray = [...this.state.tasks];
    updatedArray.push(task);
    this.setState({tasks: updatedArray});
  };

  removeTask = () => {
    console.log('remove');
    // const updatedArray = [...this.state.tasks];

    // function isEqualTo(element) {
    //   return element === id
    // }
    // const indexOf = updatedArray.findIndex(isEqualTo)

    // updatedArray.splice(indexOf, 1);
    // this.setState({tasks: updatedArray});
    // this.socket.emit('removeTask', {id: id});
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
            {this.state.tasks.map(function(task) {
              return (
                  <li key={task} className="task">{task} 
                  <button className="btn btn--red" id="btn">Remove</button></li>
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

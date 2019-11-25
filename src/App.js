import React from 'react';
import logo from './logo.svg';
import './bootstrap.min.css';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

const InitialState = {
  currentText: '',
  todoList: [],
  previousAction: '',
  todoListFilter: 'all'
};

function myReducer(state = InitialState, action){
  let newState = JSON.parse(JSON.stringify(state));
  switch(action.type){
    case 'SET_CURRENT_TEXT':
      newState.currentText = action.value;
      newState.previousAction = 'SET_CURRENT_TEXT';
      break;
    case 'ADD_ITEM':
      if(state.currentText){
        newState.todoList.push({text: state.currentText, isActive: true});
        newState.currentText = '';
        newState.previousAction = 'ADD_ITEM';
      }
      break;
    case 'TOGGLE_ITEM':
      const toggledFlag = !newState.todoList[action.listIndex].isActive;
      newState.todoList[action.listIndex].isActive = toggledFlag;
      newState.previousAction = 'TOGGLE_ITEM';
      break;
    case 'FILTER_LIST':
      const filters = ['all', 'active', 'completed'];
      if(filters.includes(action.todoListFilter)){
        newState.todoListFilter = action.todoListFilter;
        newState.previousAction = 'FILTER_LIST';
      }
      break;
    default:
      break;
  }
  return newState;
}

const myStore = createStore(myReducer);

function setCurrentText(text){
  return {type: 'SET_CURRENT_TEXT', value: text};
}

function addItem(){
  return {type: 'ADD_ITEM'};
}

function toggleItem(listIndex){
  return {type: 'TOGGLE_ITEM', listIndex: listIndex};
}

function setFilter(filter){
  return {type: 'FILTER_LIST', todoListFilter: filter};
}

class TodoInput extends React.Component {

  constructor(props){
    super(props);
    this.changeInput = this.changeInput.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  changeInput(event){
    this.props.setCurrentText(event.target.value);
  }

  addTodo(){
    this.props.addItem();
  }

  render(){
    return(
      <div class='row'>
        <div class='col-9'>
          <input class='form-control' type='text' onChange={this.changeInput} value={this.props.currentText}/>&nbsp;
        </div>
        <div class='col-3'>
          <button class='btn btn-primary' onClick={this.addTodo}>Add Todo</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps1 = (state, props) => {
  if(state.previousAction = 'ADD_ITEM'){
    return {currentText: state.currentText};
  }
  return {};
};

const mapDispatchToProps1 = {
  setCurrentText, addItem
};

const TodoInput1 = connect(mapStateToProps1, mapDispatchToProps1)(TodoInput);

class TodoList extends React.Component {

  constructor(props){
    super(props);
    this.toggleLineItem = this.toggleLineItem.bind(this);
  }

  toggleLineItem(event){
    this.props.toggleItem(event.target.dataset.index);
  }

  render(){
    let currentList = [];
    if(this.props.todoItems){
      for(let i = 0; i < this.props.todoItems.length; i++){
        const isActive = this.props.todoItems[i].isActive;
        const filter = this.props.todoListFilter;
        //const inlineStyle = isActive ? {} : {'text-decoration': 'line-through'};
        const inlineStyle = isActive ? 'list-group-item active' : 'list-group-item';
        const text = this.props.todoItems[i].text;
        if(filter === 'all' || (filter === 'active' && isActive) || 
          (filter === 'completed' && !isActive)){
          currentList.push(<li class={inlineStyle} key={i} data-index={i} onClick={this.toggleLineItem} >{text}</li>);    
          //currentList.push(<li key={i} data-index={i} onClick={this.toggleLineItem} style={inlineStyle}>{text}</li>);
        }
      }
    }
    return(<ul class='list-group mb-2'>{currentList}</ul>);
  }
}

const mapStateToProps2 = (state, props) => 
  ({todoItems: state.todoList, todoListFilter: state.todoListFilter});

const mapDispatchToProps2 = {
  toggleItem
};

const TodoList1 = connect(mapStateToProps2, mapDispatchToProps2)(TodoList);

class TodoFooter extends React.Component {
  
  constructor(props){
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
  }

  buttonClick(event){
    const id = event.target.id;
    switch(id){
      case 'all':
      case 'active':
      case 'completed':
        this.props.setFilter(id);
        break;
      default:
        break;
    }
  }

  render(){
    const filter = this.props.todoListFilter;
    const disabled = [('all' === filter ? 'disabled' : ''),
      ('active' === filter ? 'disabled' : ''),
      ('completed' === filter ? 'disabled' : '') ];
    return(<div>
      <button class='btn btn-secondary' id='all' onClick={this.buttonClick} disabled={disabled[0]}>All</button>&nbsp;
      <button class='btn btn-info' id='active' onClick={this.buttonClick} disabled={disabled[1]}>Active</button>&nbsp;
      <button class='btn btn-success' id='completed' onClick={this.buttonClick} disabled={disabled[2]}>Completed</button>
    </div>);
  }
}

const mapStateToProps3 = (state, props) => 
  ({todoListFilter: state.todoListFilter});

const mapDispatchToProps3 = {
  setFilter
};

const TodoFooter1 = connect(mapStateToProps3, mapDispatchToProps3)(TodoFooter);

function App() {
  return (
   <Provider store={myStore}>
    <div class='w-50 m-3'>
      <TodoInput1/>
      <TodoList1/>        
      <TodoFooter1/>
    </div>
   </Provider>
  );
}

export default App;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data';
import { USER_SES_KEY } from '../startup/config';

import { Tests } from '../api/tests.js';

import Test from './Test.js';

const Empty = (props) => {
  return (
    <div className="tile is-child notification is-vertical is-10">Выберите тест</div>
  );
}

const EditTest = (props) => {
  return (
    <div className="tile">edit</div>
  );
}

const ShowTest = ({match, items}) => {
  const { id } = match.params
  const [item] = items.filter(it => it._id === id)
  return (
    <div className="tile is-child notification is-vertical is-10">
      <h4>{item.name}</h4>
    </div>
  );
}


// App component - represents the whole app
class Adm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tests.insert', text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  render() {
    // let items = this.props.tests;
    let items = [{name: 'приветэ', _id: '1'},{name: 'пока', _id: '2'}];
    let itemsE = items.map((item) => {
      return (
        <li key={item._id}>
          <Link to={`/admin123/${item._id}`}>{item.name}</Link>
        </li>
      );
    });

    return (
      <div className="columns">
        <div className="menu column is-one-quarter">
          <p className="menu-label">
            Тесты
          </p>
          <ul className="menu-list">
            {itemsE}
          </ul>
          <div></div>
          <Link to="/admin123/edit" className="button is-primary is-rounded">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Добавить тест</span>
          </Link>
        </div>
        <div className="column">
          <Switch>
            <Route exact path={`${this.props.match.url}`} component={Empty} />
            <Route path={`${this.props.match.url}/edit`} component={EditTest} />
            <Route path={`${this.props.match.url}/edit/:id`} component={EditTest} />
            <Route path={`${this.props.match.url}/:id`} render={(props) => <ShowTest {...props} items={items} />}  />
          </Switch>
        </div>
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('tests');

  return {
    tests: Tests.find({}, { sort: { createdAt: -1 } }).fetch(),
    user: Session.get(USER_SES_KEY)
  };
})(Adm);

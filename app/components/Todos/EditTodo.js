import React, { PropTypes, Component } from 'react';
import {handleForms} from '../Forms/FormDecorator';
import {History, Link} from 'react-router';
import reactMixin from 'react-mixin';
import TodoCard from './TodoCard.js';
import Helmet from 'react-helmet';
import styles from './editTodo.css';
import {Todos} from '../../schemas';
import TodoForms from './TodoForms';

@handleForms
@reactMixin.decorate(History)
export default class EditTodo extends Component {
  static propTypes = {
    todo: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddFeature = this.handleAddFeature.bind(this);
    this.listenForEnter = this.listenForEnter.bind(this);
    this.state = {
      shakeBtn: false,
      formError: '',
      formSuccess: '',
      features: []
    }
  }

  render() {
    let values = this.props.inputState.values;
    let errors = this.props.inputState.errors;

    //Get values of however many features.
    let features =  _.map(values, (value, key, object) => {
      if (key.match(/(feature)\w+/g)) {
        return value
      }
    });
    //gets rid of undefined and empty feature string values
    features = _.compact(features);

    //Establishes todo inputs, including indeterminate amount of features
    let inputsToUse = [
      "currAvail",
      "displayOnMainSite",
      "isDeleted",
      this.state.features
    ];
    inputsToUse = [].concat.apply([], inputsToUse);

    return (
      <div className={styles.wrapper}>
        <Helmet
          title="Edit Todo"
          meta={[
              {"name": "description", "content": "Edit Todo"}
          ]}
        />

        <h1 className={styles.title}>Edit Todo: {this.props.todo.title}</h1>
        <div className={styles.grid}>
          <div className={styles.column}>
            <TodoForms
              buttonText="Update Todo"
              inputsToUse={inputsToUse}
              inputState={this.props.inputState}
              formError={this.state.formError}
              formSuccess={this.state.formSuccess}
              shakeBtn={this.state.shakeBtn}
              handleChange={this.props.handleChange}
              handleSubmit={this.handleSubmit}
              handleAddFeature={this.handleAddFeature}
              todo={this.props.todo} />
          </div>
          <div className={styles.column}>
            <TodoCard todo={this.props.todo} features={features}  />
          </div>
        </div>
      </div>
    );
  }

  handleAddFeature(e) {
    let features = this.state.features.slice();

    features.push("feature");

    this.setState({
      features: features
    });

    //prevent scrolling on click
    e.preventDefault();
  }

  componentDidMount() {
    let todo = this.props.todo
    const {currAvail, displayOnMainSite, isDeleted} = todo
    let features = todo.features

    let featObj = {}
    features.map((feature, i) => {
      //need to increment by 3 because there's three other editable items above
      let num = i + 3
      let featState = this.state.features;
      featState.push("feature");
      this.setState({
        features: featState
      });
      return (featObj["feature" + num] = feature)
    })
    let data = {
      currAvail: !!currAvail,
      displayOnMainSite: !!displayOnMainSite,
      isDeleted: !!isDeleted,
    }

    //Add features to other editable todo data
    data = _.extend(data, featObj);

    //sets default values in handle forms decorators
    this.props.setDefaultValues(data);

    //adds feature form when enter is pressed
    window.onkeydown = this.listenForEnter;
  }

  listenForEnter(e) {
    e = e || window.event;
    if (e.keyCode === 13) {
      this.handleAddFeature(e);
    }
  }

  handleSubmit(event, errors, values) {
    event.preventDefault();

    //don't submit if there's errors showing
    //underscore method to ensure all errors are empty strings
    let errorValues = _.values(errors);
    if (! _.every(errorValues, function(str){ return str === ''; })) {
      this.setState({
        shakeBtn: true
      });
      window.setTimeout(() => {
        this.setState({
          shakeBtn: false
        });
      }, 3000);
      return false;
    }
    const id = this.props.todo._id;
    const {isDeleted, currAvail, displayOnMainSite} = values;

    //Get values of however many features. Not bothering getting
    //errors because we're not validating feature field.
    let features =  _.map(values, (value, key, object) => {
      if (key.match(/(feature)\w+/g)) {
        return value
      }
    });
    //gets rid of undefined and empty feature string values
    features = _.compact(features);

    Meteor.call('Todo.update', id, {
      features: features,
      currAvail: !!currAvail,
      displayOnMainSite: !!displayOnMainSite,
      isDeleted: !!isDeleted
    }, (error) => {
      if (error) {
        this.setState({
          formError: error.reason,
          shakeBtn: true
        });
        window.setTimeout(() => {
          this.setState({
            shakeBtn: false
          });
        }, 3000);
        return;
      } else {
        this.setState({
          formError: "",
          formSuccess: "Todo Successfully Changed!"
        });
        window.setTimeout(() => {
          this.history.pushState(null, `/todos`);
        }, 1000);
      }
    });
  }
}

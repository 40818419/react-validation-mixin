import React from 'react';
import invariant from 'invariant';
import factory from '../validationFactory';
import result from '../utils/result';

export default function(strategy) {
  const validator = factory(strategy);
  return function(WrappedComponent) {
    invariant(WrappedComponent !== null && WrappedComponent !== undefined, 'Component was not provided to the Validator. Export you Component with "export default validator(strategy)(Component);"');
    function getDisplayName(Component) {
      return Component.displayName || Component.name || 'Component';
    }
    class Validation extends React.Component {

      constructor(props, context) {
        super(props, context);
        this.render = this.render.bind(this);
        this.validate = this.validate.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getValidationMessages = this.getValidationMessages.bind(this);
        this.clearValidations = this.clearValidations.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this._invokeCallback = this._invokeCallback.bind(this);

        this.displayName = `Validation(${getDisplayName(WrappedComponent)})`;
        this.state = { errors: {} };
      }

      /* Get current validation messages for a specified key or entire form.
       *
       * @param {?String} key to get messages, or entire form if key is undefined.
       * @return {Array}
       */
      getValidationMessages(key) {
        return validator.getValidationMessages(this.state.errors, key);
      }

      /* Convenience method to validate a key via an event handler. Useful for
       * onBlur, onClick, onChange, etc...
       *
       * @param {?String} State key to validate
       * @return {function} validation event handler
       */
      handleValidation(key, callback) {
        return () => {
          this.validate(key, callback);
        };
      }

      /* Method to validate single form key or entire form against the component data.
       *
       * @param {String|Function} key to validate, or error-first containing the validation errors if any.
       * @param {?Function} error-first callback containing the validation errors if any.
       */
      validate() {
        const _fallback = arguments.length <= 1 && typeof arguments[0] === 'function' ? arguments[0] : undefined;
        const _key = arguments.length <= 1 && typeof arguments[0] === 'function' ? undefined : arguments[0];
        const _callback = arguments.length <= 2 && typeof arguments[1] === 'function' ? arguments[1] : _fallback;

        const data = result(this.refs.component, 'getValidatorData');
        const schema = result(this.refs.component, 'validatorTypes');

        invariant(data !== null && data !== undefined, 'Data was not provided to the Validator. Implement "getValidatorData" to return data.');
        invariant(schema !== null && schema !== undefined, 'A schema was not provided to the Validator. Implement "validatorTypes" to return a validation schema.');

        const errors = {...this.state.errors, ...validator.validate(data, schema, _key)};
        this.setState({ errors }, this._invokeCallback.bind(this, _key, _callback));
      }

      /* Clear all previous validations
       *
       * @return {void}
       */
      clearValidations(callback) {
        return this.setState({
          errors: {},
        }, callback);
      }

      /* Check current validity for a specified key or entire form.
       *
       * @param {?String} key to check validity (entire form if undefined).
       * @return {Boolean}.
       */
      isValid(key) {
        return validator.isValid(this.state.errors, key);
      }

      /* Private method that handles executing users callback on validation
       *
       * @param {Object} errors object keyed on data field names.
       * @param {Function} error-first callback containing the validation errors if any.
       */
      _invokeCallback(key, callback) {
        if (typeof callback !== 'function') {
          return;
        }
        if (this.isValid(key)) {
          callback();
        } else {
          callback(this.state.errors);
        }
      }

      render() {
        return (
          <WrappedComponent
            ref="component"
            errors={this.state.errors}
            validate={this.validate}
            isValid={this.isValid}
            getValidationMessages={this.getValidationMessages}
            clearValidations={this.clearValidations}
            handleValidation={this.handleValidation}
            {...this.props}
          >
            {this.props.children}
          </WrappedComponent>
        );
      }
    }
    Validation.propTypes = {
      children: React.PropTypes.array,
    };
    return Validation;
  };
}

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodashResult = require('lodash.result');

var _lodashResult2 = _interopRequireDefault(_lodashResult);

var _validationFactory = require('../validationFactory');

var _validationFactory2 = _interopRequireDefault(_validationFactory);

var _reactDisplayName = require('react-display-name');

var _reactDisplayName2 = _interopRequireDefault(_reactDisplayName);

var _utils = require('../utils');

exports['default'] = function (strategy) {
  var validator = _validationFactory2['default'](strategy);
  return function (WrappedComponent) {
    _invariant2['default'](_utils.defined(WrappedComponent), 'Component was not provided to the Validator. Export you Component with "export default validator(strategy)(Component);"');

    var Validation = (function (_React$Component) {
      _inherits(Validation, _React$Component);

      function Validation(props, context) {
        _classCallCheck(this, Validation);

        _React$Component.call(this, props, context);
        this.render = this.render.bind(this);
        this.validate = this.validate.bind(this);
        this.isValid = this.isValid.bind(this);
        this.getValidationMessages = this.getValidationMessages.bind(this);
        this.clearValidations = this.clearValidations.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this._invokeCallback = this._invokeCallback.bind(this);

        this.state = { errors: {} };
      }

      /* Get current validation messages for a specified key or entire form.
       *
       * @param {?String} key to get messages, or entire form if key is undefined.
       * @return {Array}
       */

      Validation.prototype.getValidationMessages = function getValidationMessages(key) {
        return validator.getValidationMessages(this.state.errors, key) || [];
      };

      /* Convenience method to validate a key via an event handler. Useful for
       * onBlur, onClick, onChange, etc...
       *
       * @param {?String} State key to validate
       * @param {?Function} callback containing validation errors.
       * @param {?Object} component to validate.
       * @return {function} validation event handler
       */

      Validation.prototype.handleValidation = function handleValidation(key, callback, component) {
        var _this = this;

        return function () {
          _this.validate(key, callback, component);
        };
      };

      /* Method to validate single form key or entire form against the component data.
       *
       * @param {String|Function} key to validate, or error-first containing the validation errors if any.
       * @param {?Function} error-first callback containing the validation errors if any.
       * @param {?Object} component containing getValidatorData function.
       */

      Validation.prototype.validate = function validate() /* [key], callback, component */{
        var _this2 = this;

        var fallback = arguments.length <= 1 && typeof arguments[0] === 'function' ? arguments[0] : undefined;
        var key = arguments.length <= 1 && typeof arguments[0] === 'function' ? undefined : arguments[0];
        var callback = arguments.length <= 2 && typeof arguments[1] === 'function' ? arguments[1] : fallback;

        if (arguments[2]) this.refs.component = arguments[2];

        var data = _lodashResult2['default'](this.refs.component, 'getValidatorData');
        var schema = _lodashResult2['default'](this.refs.component, 'validatorTypes');

        _invariant2['default'](_utils.defined(data), 'Data was not provided to the Validator. Implement "getValidatorData" to return data.');
        _invariant2['default'](_utils.defined(schema), 'A schema was not provided to the Validator. Implement "validatorTypes" to return a validation schema.');

        var options = {
          key: key,
          prevErrors: this.state.errors
        };
        validator.validate(data, schema, options, function (nextErrors) {
          _this2.setState({ errors: _extends({}, nextErrors) }, _this2._invokeCallback.bind(_this2, key, callback));
        });
      };

      /* Clear all previous validations
       *
       * @return {void}
       */

      Validation.prototype.clearValidations = function clearValidations(callback) {
        return this.setState({
          errors: {}
        }, callback);
      };

      /* Check current validity for a specified key or entire form.
       *
       * @param {?String} key to check validity (entire form if undefined).
       * @return {Boolean}.
       */

      Validation.prototype.isValid = function isValid(key) {
        return validator.isValid(this.state.errors, key);
      };

      /* Private method that handles executing users callback on validation
       *
       * @param {Object} errors object keyed on data field names.
       * @param {Function} error-first callback containing the validation errors if any.
       */

      Validation.prototype._invokeCallback = function _invokeCallback(key, callback) {
        if (typeof callback !== 'function') {
          return;
        }
        if (this.isValid(key)) {
          callback();
        } else {
          callback(this.state.errors);
        }
      };

      Validation.prototype.render = function render() {
        return _react2['default'].createElement(
          WrappedComponent,
          _extends({
            ref: 'component',
            errors: this.state.errors,
            validate: this.validate,
            isValid: this.isValid,
            getValidationMessages: this.getValidationMessages,
            clearValidations: this.clearValidations,
            handleValidation: this.handleValidation
          }, this.props),
          this.props.children
        );
      };

      return Validation;
    })(_react2['default'].Component);

    Validation.displayName = 'Validation(' + _reactDisplayName2['default'](WrappedComponent) + ')';
    Validation.propTypes = {
      children: _react2['default'].PropTypes.array
    };
    return Validation;
  };
};

module.exports = exports['default'];
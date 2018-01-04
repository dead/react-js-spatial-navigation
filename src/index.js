import React, { Component } from 'react';
import PropTypes from 'prop-types';

import JsSpatialNavigation from './lib/spatial_navigation.js';

const defaultConfig = {
  activeClassName: 'active',
  focusableClassName: 'focusable',
  selector: '.focusable',
};
let config = {};

/**
* This component initialize the Spatial Navigation library.
* It should be used only one time and in the root node of the application.
* The spatial navigation only work within the Focusable components.
*/
class SpatialNavigation extends Component {

  getConfigFromProps() {
    let propsConfig = {};

    // React Custom: Set activeClassName
    if (typeof this.props.activeClassName === 'string') {
      propsConfig.activeClassName = this.props.activeClassName;
    }

    // React Custom: Set focusableClassName
    if (typeof this.props.focusableClassName === 'string') {
      propsConfig.focusableClassName = this.props.focusableClassName;
    }

    // React Custom: Set customInit
    if (typeof this.props.customInit === 'function') {
      propsConfig.customInit = this.props.customInit;
    }

    // Set defaultElement
    if (typeof this.props.defaultElement === 'string') {
      propsConfig.defaultElement = this.props.defaultElement;
    }

    // Set disabled
    if (typeof this.props.disabled === 'boolean') {
      propsConfig.disabled = this.props.disabled;
    }

    // Set enterTo
    if (typeof this.props.enterTo === 'string') {
      propsConfig.enterTo = this.props.enterTo;
    }

    // Set leaveFor
    if (typeof this.props.leaveFor === 'object') {
      propsConfig.leaveFor = this.props.leaveFor;
    }

    // Set navigableFilter
    if (typeof this.props.navigableFilter === 'function') {
      propsConfig.navigableFilter = this.props.navigableFilter;
    }

    // Set rememberSource
    if (typeof this.props.rememberSource === 'string') {
      propsConfig.rememberSource = this.props.rememberSource;
    }

    // Set restrict
    if (typeof this.props.restrict === 'string') {
      propsConfig.restrict = this.props.restrict;
    }

    // Set selector
    if (typeof this.props.selector === 'string') {
      propsConfig.selector = this.props.selector;
    }

    // Set straightOnly
    if (typeof this.props.straightOnly === 'boolean') {
      propsConfig.straightOnly = this.props.straightOnly;
    }

    // Set straightOverlapThreshold
    if (typeof this.props.straightOverlapThreshold === 'number') {
      propsConfig.straightOverlapThreshold = this.props.straightOverlapThreshold;
    }

    // Set tabIndexIgnoreList
    if (typeof this.props.tabIndexIgnoreList === 'string') {
      propsConfig.tabIndexIgnoreList = this.props.tabIndexIgnoreList;
    }

    return propsConfig;
  }

  componentWillMount() {
    config = Object.assign(defaultConfig, this.getConfigFromProps.call(this));
  }

  componentDidMount() {
    if (!this.props.customInit) {
      JsSpatialNavigation.init();
      JsSpatialNavigation.add(config);
      JsSpatialNavigation.focus();

    } else {
      this.props.customInit.call(this, config);
    }
  }

  componentWillUnmount() {
    JsSpatialNavigation.uninit();
  }

  render() {
    let classNames = [];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(" ")}>{this.props.children}</div>
    );
  }
}

function getSelector(id) {
  return `.${id}`;
}

/**
* A Focusable component that handle the onFocus, onUnfocus, onClickEnter events.
*
* Props:
*   onFocus: (optional)
*     A function that will be fired when the component is focused.
*
*   onUnfocus: (optional)
*     A function that will be fired when the component is unfocused.
*
*   onClickEnter: (optional)
*     A function that will be fired when the component is focused and enter key is pressed.
*/
class Focusable extends Component {
  componentFocused(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  componentUnfocused(e) {
    if (this.props.onUnfocus) {
      this.props.onUnfocus(e);
    }
  }

  componentClickEnter(e) {
    if (this.props.onClickEnter) {
      this.props.onClickEnter(e);
    }
  }

  _componentFocused = (event) => this.componentFocused(event);
  _componentUnfocused = (event) => this.componentUnfocused(event);
  _componentClickEnter = (event) => this.componentClickEnter(event);

  componentDidMount() {
    if (!this.el)
      return;

    this.el.addEventListener("sn:focused", this._componentFocused);
    this.el.addEventListener("sn:unfocused", this._componentUnfocused);
    this.el.addEventListener("sn:enter-up", this._componentClickEnter);
  }

  componentWillUnmount() {
    this.el.removeEventListener("sn:focused", this._componentFocused);
    this.el.removeEventListener("sn:unfocused", this._componentUnfocused);
    this.el.removeEventListener("sn:enter-up", this._componentClickEnter);
  }

  render() {
    let classNames = [this.context.focusableSectionId ? this.context.focusableSectionId : config.focusableClassName];

    if (this.props.active) {
      classNames.push(config.activeClassName);
    }

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(" ")} ref={e => this.el = e} tabIndex="-1">
        {this.props.children}
      </div>
    );
  }
}

Focusable.contextTypes = {
  focusableSectionId: PropTypes.string
};

/*
* A Focusable Section can specify a behaviour before focusing an element.
* I.e. selecting a default element, the first element or an active one.
*
* Props:
*   defaultElement: (default: '')
*     The default element that will be focused when entering this section.
*     This can be:
*       * a valid selector string for "querySelectorAll".
*       * a NodeList or an array containing DOM elements.
*       * a single DOM element.
*       * an empty string.
*
*   enterTo: (default: 'default-element')
*     If the focus comes from another section, you can define which element in this section should be focused first.
*     This can be:
*       * 'last-focused' indicates the last focused element before we left this section last time. If this section has never been focused yet, the default element (if any) will be chosen next.
*       * 'default-element' indicates the element defined in defaultElement.
*       * an empty string.
*/
class FocusableSection extends Component {
  getChildContext() {
    return {focusableSectionId: this.sectionId};
  }

  componentWillMount() {
    this.sectionId = JsSpatialNavigation.add({});
  }

  componentWillUnmount() {
    JsSpatialNavigation.remove(this.sectionId);
  }

  _getSelector() {
    return getSelector(this.sectionId);
  }

  componentDidMount() {
    let defaultElement = this.props.defaultElement;
    const enterTo = this.props.enterTo === undefined ? 'default-element' : this.props.enterTo;

    if (defaultElement && defaultElement === 'first') {
      defaultElement = this._getSelector() + ':first-child';
    }

    if (defaultElement && defaultElement === 'active') {
      defaultElement = this._getSelector() + `.${config.activeClassName}`;
    }

    JsSpatialNavigation.set(this.sectionId, {
      selector: this._getSelector(),
      enterTo: enterTo,
      defaultElement: defaultElement
    });
  }

  render() {
    let classNames = [];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(" ")}>
        {this.props.children}
      </div>
    );
  }
}

FocusableSection.childContextTypes = {
  focusableSectionId: PropTypes.string
};


export { SpatialNavigation as default, FocusableSection, Focusable, JsSpatialNavigation };

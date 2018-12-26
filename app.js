"use strict";

// BUDGET CONTROLLER
var budgetController = (function() {

//  Create objects with input values
function Expence(type, description, value) {
  this.type = type;
  this.desc = description;
  this.value = value;
};

function Income(type, description, value) {
  this.type = type;
  this.desc = description;
  this.value = value;
};

// All amounts
var data = {
  allItems: {
    inc: [],
    exp: []
  },
  total: {
    inc: [],
    exp: []
  }
};


  return {
    // Create a new object and add to the data
    addItem: function(type, description, value) {
      var newItem;

      if (type === 'inc') {
        newItem = new Income(type, description, value);
      } else if (type === 'exp') {
        newItem = new Expence(type, description, value);
      }

      data.allItems[type].push(newItem);

      localStorage.setItem('oppa', JSON.stringify(data));

      return newItem;
    },

    // Check the Data
    data: data

  };
})();

// UI CONTROLLER
var UIController = (function() {
  // DOM elements
  var DOMelements = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    inc: ".income__list",
    exp: ".expenses__list"
  };

  // New DOM Element classes
  var newDOM = {
    listItem: "item clearfix",
    itemDesc: "item__description",
    itemRight: "right clearfix",
    itemValue: "item__value",
    itemDel: "item__delete",
    itemButton: "item__delete--btn",
    itemIcon: "ion-ios-close-outline"
  };

  // Create Element
  var createElement = function(elem, obj, ...children) {
    var element = document.createElement(elem);

    for (var key in obj) {
      element[key] = obj[key];
    } 

    if (children.length > 0) {
      children.forEach(function(child) {
        
        if (typeof child === 'string') {
          child = document.createTextNode(child);
        }

        element.appendChild(child);
      });
    }

    return element;
  };

  return {
    // Get DOM elements class names
    getDOM: function() {
      return DOMelements;
    },

    // Get Values from inputs
    getValues: function() {
      return {
        type: document.querySelector(DOMelements.inputType).value,
        description: document.querySelector(DOMelements.inputDescription).value,
        value: document.querySelector(DOMelements.inputValue).value
      };
    },

    // Add List Item
    addListItem: function(obj) {

      var itemIcon = createElement('div', { className: newDOM.itemIcon });
      var itemBtn = createElement('div', { className: newDOM.itemButton }, itemIcon);
      var itemDel = createElement('div', { className: newDOM.itemDel }, itemBtn);
      var itemDesc = createElement('div', { className: newDOM.itemValue }, obj.value);
      var itemRight = createElement('div', { className: newDOM.itemRight }, itemDesc, itemDel);
      var itemTitle = createElement('div', { className: newDOM.itemDesc }, obj.desc)
      var listItem = createElement('div', { className: newDOM.listItem }, itemTitle, itemRight,);

      document.querySelector(DOMelements[obj.type]).appendChild(listItem);
    },

  };
})();

// APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl) {
  // Get DOM elements
  var DOM = UICtrl.getDOM();

  // Set event listeners
  var setEventListeners = function() {
    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      addItem();
    });

    document.body.addEventListener("keypress", function(event) {
      if (event.keyCode === 13) {
        addItem();
      }
    });
  };

  // Add new Item
  var addItem = function() {
    // Get Input Values
    var input = UICtrl.getValues();

    // Get New Object
    var obj = budgetCtrl.addItem(input.type, input.description, input.value);

    UICtrl.addListItem(obj);

    console.log(obj);
    console.log(budgetController.data);
  };

  return {
    // Initialization
    init: function() {
      setEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();



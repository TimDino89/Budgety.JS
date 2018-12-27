"use strict";

// BUDGET CONTROLLER
var budgetController = (function() {

//  Create objects with input values
function Income(id, type, description, value) {
  this.id = id;
  this.type = type;
  this.desc = description;
  this.value = value;
};

function Expence(id, type, description, value) {
  this.id = id;
  this.type = type;
  this.desc = description;
  this.value = value;
  this.perc = -1;
};

// Expence.prototype.calcPercentages = function() {
//   var sum = calcTotal('inc');

//   if (sum > 0) {
//     this.perc = Math.round((this.value / sum) * 100);
//   } else {
//     this.perc = -1;
//   }
// };

// DATA
var data = {
  allItems: {
    inc: [],
    exp: []
  },
  total: {
    inc: [],
    exp: []
  },
  budget: 0
};

// Calculate Total Incomes and Expences
var calcTotal = function(type) {
  var sum = 0;

  for (var i = 0; i < data.total[type].length; i++) {
    sum += data.total[type][i];
  }

  return sum;
};

  return {
    // Create a new object and add to the data
    addItem: function(type, description, value) {
      var newItem, id;

      // Define ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create new Income or Expence object
      if (type === 'inc') {
        newItem = new Income(id, type, description, value);
      } else if (type === 'exp') {
        newItem = new Expence(id, type, description, value);
      }

      // Add object to data
      data.allItems[type].push(newItem);

      // Add values to data
      data.total[type].push(+newItem.value);

      return newItem;
    },

    // Calculate Budget
    calculateBudget: function() {  
      var income = calcTotal('inc');
      var expence = calcTotal('exp');

      data.budget = income - expence;

      var perc = Math.round((expence / income) * 100);

      var allAmounts = {
        inc: income,
        exp: expence,
        budget: data.budget,
        perc: perc
      };

      return allAmounts;
    },

    // storage Data in local storage
    setStorage: function() {
      localStorage.setItem('data', JSON.stringify(data));
    },

    // Get Data from local storage
    getStorage: function() {
      var localData = JSON.parse(localStorage.getItem('data'));
      return localData;
    },

    // Update Data
    updateData: function(storedData) {
      data.allItems = storedData.allItems;
      data.total = storedData.total;
      data.budget = storedData.budget;
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
    container: ".container",
    inc: ".income__list",
    exp: ".expenses__list",
    budgetOut: ".budget__value",
    incomeOut: ".budget__income--value",
    expenceOut: ".budget__expenses--value",
    expencePerc: ".budget__expenses--percentage"
  };

  // New DOM Element classes
  var newDOM = {
    listItem: "item clearfix",
    itemDesc: "item__description",
    itemRight: "right clearfix",
    itemValue: "item__value",
    itemDel: "item__delete",
    itemButton: "item__delete--btn",
    // itemIcon: "ion-ios-close-outline",
    perc: "item__percentage"
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

    // Clear input
    clearInput: function() {
      document.querySelector(DOMelements.inputDescription).value = '';
      document.querySelector(DOMelements.inputValue).value = '';

      document.querySelector(DOMelements.inputDescription).focus();
    },

    // Add new item to UI
    addListItem: function(obj) {     
      // Clear HTML
      document.querySelector(DOMelements.inc).innerHTML = '';
      document.querySelector(DOMelements.exp).innerHTML = '';

      // Create new listItem
      for (var key in obj) {
        for (var i = 0; i < obj[key].length; i++) {

          var percentage = '';

        var itemIcon = createElement('div', { className: newDOM.itemIcon });
        var itemBtn = createElement('div', { className: newDOM.itemButton }, 'x');
        var itemDel = createElement('div', { className: newDOM.itemDel }, itemBtn);
        var itemDesc = createElement('div', { className: newDOM.itemValue }, obj[key][i].value);
        var itemRight = createElement('div', { className: newDOM.itemRight }, itemDesc, percentage, itemDel);
        var itemTitle = createElement('div', { className: newDOM.itemDesc }, obj[key][i].desc)
        var listItem = createElement('div', { className: newDOM.listItem, id: obj[key][i].type + '-' + obj[key][i].id }, itemTitle, itemRight);
        var wrapper = createElement('div', { className: '.wrapper' }, listItem);

        var text = wrapper.innerHTML;

        // Write new HTML
        document.querySelector(DOMelements[obj[key][i].type]).innerHTML += text;
        }
      }
    },

    // Delete Item
    deleteItem: function() {
      console.log('test delete');
      console.log(event.target.closest('.item'));
    },

    // Display BUDGET
    displayBudget: function(obj) {
      document.querySelector(DOMelements.budgetOut).textContent = obj.budget;
      document.querySelector(DOMelements.incomeOut).textContent = obj.inc;
      document.querySelector(DOMelements.expenceOut).textContent = obj.exp;
      document.querySelector(DOMelements.expencePerc).textContent = obj.perc + '%';
    },

  };
})();

// APP CONTROLLER
var appController = (function(budgetCtrl, UICtrl) {
  // Get DOM elements
  var DOM = UICtrl.getDOM();

  // Set Event on Add Button
  var setEventListeners = function() {
    document.querySelector(DOM.addBtn).addEventListener("click", function() {
      addItem();
    });

    // Set event on ENTER key
    document.body.addEventListener("keypress", function(event) {
      if (event.keyCode === 13) {
        addItem();
      }
    });

    // Set event on Delete Button
    document.querySelector(DOM.container).addEventListener('click', function(event){
      if (event.target.className === "item__delete--btn") {
        deleteItem();
      }
    });
  };

  // Update DATA
  var updateData = function() {
    // Get data from local storage
    var storedData = budgetCtrl.getStorage();

    // Update data using stored data
    if (storedData) {
    budgetCtrl.updateData(storedData);

      // Display list Items
    UICtrl.addListItem(storedData.allItems);
    }    

    // Display Budget
    var budget = budgetCtrl.calculateBudget();

    UICtrl.displayBudget(budget);

    // Teeeeeeeeeeest
    console.log(storedData);
  };

  // Add new Item
  var addItem = function() {
    // Get Input Values
    var input = UICtrl.getValues();

    // Get New Object
    var obj = budgetCtrl.addItem(input.type, input.description, input.value);

    console.log(obj);

    // Calculate budget
    budgetCtrl.calculateBudget();

    // Set data to local storage
    budgetCtrl.setStorage();

    // get updated data from local storage
    var storage = budgetCtrl.getStorage();

    // Add new listItem
    UICtrl.addListItem(storage.allItems);

    // Clear Input
    UICtrl.clearInput();

    UICtrl.displayBudget(budgetCtrl.calculateBudget());

    // Teeeeeeeeeeest
    console.log(storage);
  };

  var deleteItem = function(e) {
    // Delete from data

    // Update data

    

    // Delete from UI
    UICtrl.deleteItem();
  };

  return {
    // Initialization
    init: function() {
      setEventListeners();
      updateData();
    }
  };
})(budgetController, UIController);

appController.init();



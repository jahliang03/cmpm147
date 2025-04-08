// project.js - Recipe Generator using OOP
// Author: Jasmine Liang
// Date: 04/07/25

// Define references to DOM elements
let box = null;
let clicker = null;

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }

  // define a method
  myMethod() {
    const fillers = {
      mood: [
        "hungry", "inspired", "bored", "adventurous", "slightly desperate",
        "tired", "emotionally unstable", "depressed"
      ],
      produce: [
        "tomatoes", "carrots", "spinach", "bell peppers", "broccoli", "mushrooms",
        "onions", "garlic", "zucchini", "frozen corn",
        "half a lemon", "avocado", "apple slices", "leftover kale"
      ],
      starches: [
        "white rice", "brown rice", "pasta", "ramen noodles", "quinoa",
        "mashed potatoes", "bread", "tortillas", "couscous", "cold fries",
        "instant noodles", "old crackers", "sweet potatoes"
      ],
      spices: [
        "paprika", "turmeric", "cumin", "chili flakes", "black pepper",
        "curry powder", "Italian seasoning", "garlic powder", "cinnamon",
        "smoked paprika", "nutmeg", "taco seasoning"
      ],
      condiments: [
        "soy sauce", "sriracha", "mayo", "mustard", "ranch",
        "BBQ sauce", "hot sauce", "ketchup", "honey",
        "balsamic vinegar", "peanut butter", "pesto",
        "cream cheese", "sesame oil"
      ],
      protein: [
        "eggs", "canned tuna", "tofu", "tempeh", "rotisserie chicken",
        "chickpeas", "ground beef", "black beans", "bacon bits",
        "frozen meatballs", "turkey slices", "lentils",
        "imitation crab", "leftover steak"
      ],
      tool: [
        "frying pan", "air fryer", "microwave", "oven", "slow cooker",
        "rice cooker", "saucepan", "bare hands"
      ],
      vibe: [
        "delight your senses", "confuse your enemies", "create kitchen chaos",
        "achieve inner peace", "embrace the weird", "impress literally no one but yourself"
      ],
      result: [
        "a lovely meal", "a snack worth crying over", "your new comfort food", "an exciting new combination"
      ],
      time: [
        "10 minutes", "long enough for protein to cook through", "while your laundry finishes",
        "ten minutes on medium heat", "just long enough to question your life choices"
      ]
    };

    const template = `Chef, you seem $mood today. Here’s what you’ll cook: Grab some $produce and pair it with $starches. Add in $protein and toss it all in your $tool. Spice it up with $spices and finish with a dollop of $condiments to $vibe. Do it all in $time and behold... $result!`;

    const slotPattern = /\$(\w+)/;

    function replacer(match, name) {
      let options = fillers[name];
      if (options) {
        return options[Math.floor(Math.random() * options.length)];
      } else {
        return `<UNKNOWN:${name}>`;
      }
    }

    function generate() {
      let story = template;
      while (story.match(slotPattern)) {
        story = story.replace(slotPattern, replacer);
      }
      box.innerText = story;
    }

    clicker.onclick = generate;

    generate(); // Generate a recipe on load
  }
}

// main function that runs after DOM content is loaded
function main() {
  box = document.getElementById("box");
  clicker = document.getElementById("clicker");

  // create an instance of the class
  const myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
}

// Run main when DOM is fully loaded
window.addEventListener("DOMContentLoaded", main);

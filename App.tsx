import React, { useState } from 'react';
import { Send, ShoppingCart, DollarSign, Sparkles, Apple } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

interface FoodItem {
  name: string;
  category: string;
  averagePrice: number;
}

const commonFoodItems: FoodItem[] = [
  // Proteins
  { name: "salmon fillet", category: "protein", averagePrice: 12.99 },
  { name: "ground beef", category: "protein", averagePrice: 6.99 },
  { name: "turkey breast", category: "protein", averagePrice: 7.99 },
  { name: "tofu", category: "protein", averagePrice: 3.99 },
  { name: "eggs", category: "protein", averagePrice: 3.99 },
  { name: "shrimp", category: "protein", averagePrice: 13.99 },
  
  // Dairy
  { name: "milk", category: "dairy", averagePrice: 3.49 },
  { name: "greek yogurt", category: "dairy", averagePrice: 4.99 },
  { name: "cheddar cheese", category: "dairy", averagePrice: 4.99 },
  { name: "mozzarella", category: "dairy", averagePrice: 4.49 },
  { name: "butter", category: "dairy", averagePrice: 4.99 },
  
  // Grains
  { name: "quinoa", category: "grains", averagePrice: 5.99 },
  { name: "brown rice", category: "grains", averagePrice: 4.99 },
  { name: "whole wheat bread", category: "grains", averagePrice: 3.99 },
  { name: "pasta", category: "grains", averagePrice: 1.99 },
  { name: "oatmeal", category: "grains", averagePrice: 3.99 },
  
  // Produce
  { name: "spinach", category: "produce", averagePrice: 2.99 },
  { name: "avocados", category: "produce", averagePrice: 1.99 },
  { name: "sweet potatoes", category: "produce", averagePrice: 1.49 },
  { name: "bell peppers", category: "produce", averagePrice: 1.99 },
  { name: "bananas", category: "produce", averagePrice: 0.99 },
  { name: "broccoli", category: "produce", averagePrice: 2.49 },
  { name: "carrots", category: "produce", averagePrice: 1.49 },
  { name: "tomatoes", category: "produce", averagePrice: 2.49 },
  { name: "mushrooms", category: "produce", averagePrice: 3.99 },
  
  // Pantry Items
  { name: "olive oil", category: "pantry", averagePrice: 8.99 },
  { name: "black beans", category: "pantry", averagePrice: 1.49 },
  { name: "almonds", category: "pantry", averagePrice: 7.99 },
  { name: "peanut butter", category: "pantry", averagePrice: 4.99 },
  { name: "honey", category: "pantry", averagePrice: 5.99 }
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your AI Grocery Budget Planner. I can help you plan your grocery budget and suggest meal ideas. What's your weekly grocery budget? Or tell me what food items you're looking for!",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [currentBudget, setCurrentBudget] = useState<number | null>(null);

  const getSuggestedItems = (budget: number) => {
    const suggestions: FoodItem[] = [];
    let remainingBudget = budget;
    const categories = ['protein', 'produce', 'grains', 'dairy', 'pantry'];
    
    categories.forEach(category => {
      const categoryItems = commonFoodItems
        .filter(item => item.category === category && item.averagePrice <= remainingBudget)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
      
      suggestions.push(...categoryItems);
      remainingBudget -= categoryItems.reduce((sum, item) => sum + item.averagePrice, 0);
    });

    return suggestions;
  };

  const handleFoodItemRequest = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Handle greetings
    if (lowerText.includes('hi') || lowerText.includes('hello')) {
      return "Hi there! 👋 I'm your AI Budget Planner! I can help you manage your grocery budget and suggest food items. Would you like to set a budget or search for specific items?";
    }

    if (lowerText.includes('suggest') || lowerText.includes('recommendation')) {
      const budget = currentBudget || 100; // Default budget if none set
      const suggestions = getSuggestedItems(budget);
      const totalCost = suggestions.reduce((sum, item) => sum + item.averagePrice, 0);
      
      return `Here are some suggested items within ${currentBudget ? 'your' : 'a'} budget of $${budget}:\n\n${
        suggestions.map(item => `• ${item.name} ($${item.averagePrice.toFixed(2)})`).join('\n')
      }\n\nTotal cost: $${totalCost.toFixed(2)}${
        currentBudget ? `\nRemaining budget: $${(currentBudget - totalCost).toFixed(2)}` : ''
      }`;
    }

    const searchTerms = text.toLowerCase().split(' ');
    const matchedItems = commonFoodItems.filter(item =>
      searchTerms.some(term => item.name.includes(term))
    );

    if (matchedItems.length === 0) {
      return `I couldn't find specific items matching "${text}". Would you like some food suggestions? Just ask for recommendations!`;
    }

    if (currentBudget === null) {
      const totalCost = matchedItems.reduce((sum, item) => sum + item.averagePrice, 0);
      return `I found these items:\n${matchedItems.map(item => 
        `• ${item.name} (avg. price: $${item.averagePrice.toFixed(2)})`
      ).join('\n')}\n\nTotal estimated cost: $${totalCost.toFixed(2)}\n\nWould you like to set a weekly budget to help plan your groceries better?`;
    } else {
      const totalCost = matchedItems.reduce((sum, item) => sum + item.averagePrice, 0);
      const remainingBudget = currentBudget - totalCost;
      
      return `I found these items within your budget of $${currentBudget}:\n${matchedItems.map(item => 
        `• ${item.name} (avg. price: $${item.averagePrice.toFixed(2)})`
      ).join('\n')}\n\nTotal cost: $${totalCost.toFixed(2)}\nRemaining budget: $${remainingBudget.toFixed(2)}\n\nWould you like suggestions for your remaining budget? Just ask for recommendations!`;
    }
  };

  const handleBudgetInput = (budget: number) => {
    setCurrentBudget(budget);
    return `Great! With a weekly budget of $${budget}, I recommend:\n
• $${(budget * 0.3).toFixed(2)} for proteins (meat, fish, eggs)
• $${(budget * 0.25).toFixed(2)} for fresh produce
• $${(budget * 0.2).toFixed(2)} for grains and staples
• $${(budget * 0.15).toFixed(2)} for dairy products
• $${(budget * 0.1).toFixed(2)} for snacks and extras\n
Would you like some specific food suggestions within this budget? Just ask for recommendations!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, isUser: true }]);

    // Process input
    const budget = parseFloat(input);
    let response = '';

    if (!isNaN(budget)) {
      response = handleBudgetInput(budget);
    } else {
      response = handleFoodItemRequest(input);
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">AI Grocery Budget Planner</h1>
          </div>
          <p className="mt-2 text-gray-600">Get personalized grocery budgeting advice and meal planning suggestions</p>
          {currentBudget && (
            <div className="mt-3 flex items-center gap-2 text-green-600">
              <DollarSign className="w-4 h-4" />
              <span>Current Budget: ${currentBudget}</span>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="space-y-4 mb-4 h-[400px] overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.isUser ? (
                    <div className="flex items-center gap-2">
                      {!isNaN(parseFloat(message.text)) && <DollarSign className="w-4 h-4" />}
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentBudget ? "Search for food items or ask for suggestions..." : "Enter budget or search food items..."}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Plan your meals for the week before shopping</li>
            <li>Buy in bulk for non-perishable items</li>
            <li>Compare prices between stores</li>
            <li>Look for seasonal produce for better prices</li>
            <li>Use a shopping list to avoid impulse purchases</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to send a message
async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const message = userInput.value.trim();
  // Clear input field after sending message
  userInput.value = "";
  if (message === "") return; // Ignore empty messages

  // Append user message to chat box
  appendMessage("user", message);

  try {
    // Get bot response
    const botResponse = await getBotResponseAI(message);
    // Format bot response
    const formattedResponse = formatResponse(botResponse);
    // Append bot response to chat box
    appendMessage("bot", formattedResponse);
  } catch (error) {
    // Handle error
    console.error("Error fetching bot response:", error);
    appendMessage("bot", "Bot: Sorry, I couldn't process your request.");
  }

  // Scroll to the bottom of the chat box
  scrollChatToBottom();
}

// Function to append a message to the chat box
function appendMessage(sender, message) {
  const chatBox = document.getElementById("chatBox");
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender);

  const messageText = document.createElement("div");
  messageText.innerText = message;
  messageElement.appendChild(messageText);

  // Add copy button for bot messages
  if (sender === "bot") {
    const copyButton = document.createElement("button");
    copyButton.innerText = `COPY`;
    copyButton.classList.add("copy-btn");
    copyButton.addEventListener("click", function () {
      copyToClipboard(message);
    });
    messageElement.appendChild(copyButton);
  }

  chatBox.appendChild(messageElement);

  // Scroll to the bottom of the chat box
  scrollChatToBottom();
}

// Placeholder function for fetching bot response using Google Generative AI
async function getBotResponseAI(message) {
  // Replace 'YOUR_API_KEY' with your actual API key
  const apiKey = "AIzaSyCP4-mZ7V1sHwH1KglhobHbehA44r920Zc";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(message);
  const response = await result.response;
  return response.text();
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const copyButton = document.querySelector(".copy-btn");
      copyButton.innerText = "Copied";
      setTimeout(() => {
        copyButton.innerText = "Copy";
      }, 3000);
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
}

// Function to scroll the chat box to the bottom
function scrollChatToBottom() {
  const chatBox = document.getElementById("chatBox");
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Format the bot response
const formatResponse = (response) => {
  const sections = response.split("**");
  if (sections.length < 2) {
    // Return the response as is if it doesn't contain expected sections
    return response;
  }

  let formattedResponse = "";

  for (let i = 1; i < sections.length; i += 2) {
    const category = sections[i].trim();
    const items = sections[i + 1]
      .trim()
      .split("*")
      .filter((item) => item.trim() !== "");

    formattedResponse += `**${category}:**\n`;

    items.forEach((item) => {
      formattedResponse += `* ${item.trim()}\n`;
    });

    formattedResponse += "\n";
  }

  return formattedResponse.trim().replace(/\*/g, "");
};

// Event listener for sending message on button click
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Event listener for sending message on pressing Enter key
document
  .getElementById("userInput")
  .addEventListener("keypress", function (event) {
    // Send message if Enter key is pressed
    if (event.key === "Enter") {
      sendMessage();
    }
  });

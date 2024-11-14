// // content-script.js
// let overlayContainer = null;
// let isOverlayVisible = false;

// function createOverlay() {
//   // Create the toggle button
//   console.log("Creating overlay..."); // Debugging line

//   const toggleButton = document.createElement('div');
//   toggleButton.className = 'toggle-overlay';
//   toggleButton.innerHTML = '💬';
//   document.body.appendChild(toggleButton);

//   // Create the overlay container
//   overlayContainer = document.createElement('div');
//   overlayContainer.className = 'leetcode-helper-overlay';
//   overlayContainer.style.display = 'none';

//   // Inject your extension's HTML into the overlay container
//   overlayContainer.innerHTML = `
//     <div class="container">
//       <div class="popup-header">
//         <h1 class="popup-title">Socrate</h1>
//         <p class="popup-subtitle">AI-powered DSA learning companion</p>
//         <button id="closeOverlayButton">Close</button>
//       </div>
      
//       <div class="problem-info">
//         <div class="status-indicator">
//           <span class="dot"></span>
//           <span class="status-text">Ready to assist</span>
//         </div>
//       </div>
      
//       <div class="action-buttons">
//         <button id="copyButton" class="primary-button">
//           <span class="icon">📋</span> Copy Question
//         </button>
        
//         <button id="helpButton" class="secondary-button">
//           <span class="icon">🎯</span> Help
//         </button>
//       </div>
      
//       <div class="chat-window hidden" id="chatWindow">
//         <div id="chatMessages" class="messages"></div>
//         <form id="chatForm" class="chat-form">
//           <input type="text" id="chatInput" placeholder="Ask about sorting algorithms..." class="chat-input">
//           <button type="submit" class="chat-submit-button">📤</button>
//         </form>
//       </div>
      
//       <div class="footer">
//         <a href="https://github.com/AnshJain9159/pseudo.git" target="_blank" rel="noopener" class="icon-button github-link" title="Visit our GitHub">
//           <svg height="24" width="24" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" class="github-icon">
//             <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
//           </svg>
//         </a>
//       </div>
//     </div>
//   `;

//   document.body.appendChild(overlayContainer);
//   console.log("Overlay created and appended"); // Debugging line

//   // Toggle overlay visibility
//   toggleButton.addEventListener('click', () => {
//     isOverlayVisible = !isOverlayVisible;
//     overlayContainer.style.display = isOverlayVisible ? 'block' : 'none';
//   });

//   // Close button to hide the overlay
//   document.getElementById('closeOverlayButton').addEventListener('click', () => {
//     overlayContainer.style.display = 'none';
//     isOverlayVisible = false;
//   });

//   // Make overlay draggable
//   makeDraggable(overlayContainer);
// }

// function makeDraggable(element) {
//   let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   const header = element.querySelector('.popup-header') || element;

//   header.style.cursor = 'move';
//   header.onmousedown = dragMouseDown;

//   function dragMouseDown(e) {
//     e.preventDefault();
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {
//     e.preventDefault();
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     element.style.top = (element.offsetTop - pos2) + "px";
//     element.style.left = (element.offsetLeft - pos1) + "px";
//   }

//   function closeDragElement() {
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }

// // Initialize the overlay when the page loads
// document.addEventListener('DOMContentLoaded', createOverlay);

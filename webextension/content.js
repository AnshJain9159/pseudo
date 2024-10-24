document.addEventListener('DOMContentLoaded', () => {
  // Select the question title and description container
  const titleElement = document.querySelector('.text-title-large.font-semibold.text-text-primary');  // Adjust based on LeetCode's DOM structure
  const descriptionElement = document.querySelector('.elfjS[data-track-load="description_content"]');

  if (titleElement && descriptionElement) {
    const questionTitle = titleElement.innerText;
    let questionDescription = '';

    // Loop through all the <p> and <pre> tags inside the description div
    descriptionElement.querySelectorAll('p, pre').forEach((el) => {
      questionDescription += el.innerText + '\n'; // Adding new line for each tag's content
    });

    // Send the question title and description to the background script
    chrome.runtime.sendMessage({ 
      action: 'setQuestion', 
      question: `${questionTitle}\n\n${questionDescription}`
    }, (response) => {
      if (response.status === 'success') {
        console.log('Question title and description sent to background script.');
      }
    });
  } else {
    console.log('Question elements not found.');
  }
});

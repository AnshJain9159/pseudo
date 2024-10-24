document.getElementById('copyButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyQuestion
  });
});

function copyQuestion() {
  function getLeetCodeQuestion() {
    const title = document.querySelector('.text-title-large.font-semibold.text-text-primary')?.innerText || 'Title not found';
    const content = document.querySelector('.elfjS[data-track-load="description_content"]');
    
    let description = '';
    if (content) {
      content.querySelectorAll('p, pre').forEach((el) => {
        description += el.innerText + '\n';
      });
    } else {
      description = 'Description not found';
    }

    return { title, description };
  }

  function copyToClipboard(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
  }

  const question = getLeetCodeQuestion();
  const formattedText = `${question.title}\n\n${question.description}`;
  copyToClipboard(formattedText);
  alert("LeetCode question copied to clipboard!");
}

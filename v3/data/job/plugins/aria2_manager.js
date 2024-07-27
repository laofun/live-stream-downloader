/* global storage */

storage.get({
    'send_to_aria2_manager': true,
    'aria2_threads': 8,
    'aria2_manager_id': ''
  }).then(prefs => {
    document.getElementById('send_to_aria2_manager').checked = prefs['send_to_aria2_manager'];
    document.getElementById('aria2_threads').value = prefs['aria2_threads'];
    document.getElementById('aria2_manager_id').value = prefs['aria2_manager_id'];
    toggleSendAria2Buttons(prefs['send_to_aria2_manager']);

    document.getElementById('online-resolve-name').onchange = e => storage.set({
        'online-resolve-name': e.target.checked
      });
      
      document.getElementById('send_to_aria2_manager').onchange = e => {
        const isChecked = e.target.checked;
        storage.set({
          'send_to_aria2_manager': isChecked
        });
        toggleSendAria2Buttons(isChecked);
      };
      
      document.getElementById('aria2_threads').oninput = e => storage.set({
        'aria2_threads': e.target.value
      });
      
      document.getElementById('aria2_manager_id').oninput = e => storage.set({
        'aria2_manager_id': e.target.value
      });
  });
  
  function toggleSendAria2Buttons(show) {
    const buttons = document.querySelectorAll('[data-id="send-aria2"]');
    buttons.forEach(button => {
      if (show) {
        button.disabled = false;
      } else {
        button.disabled = true;
      }
    });
  }
  document.addEventListener('DOMContentLoaded', function() {
      // Function to send download link to Aria2-Manager
      function sendToAria2(link, filename) {
          const referrer = document.getElementById('referer').innerText;
          const aria2ManagerId = document.getElementById('aria2_manager_id').value;
          const threads = document.getElementById('aria2_threads').value;
          const downloadItem = {
              url: link,
              filename: filename,
              referrer: referrer,
              options: {
                  split: threads // aria2 RPC options here
                  // xxxxx: "oooo"
              }
          };
          chrome.runtime.sendMessage(aria2ManagerId, downloadItem);
      }
  
      // Check if "Send to Aria2-Manager" is enabled
      function isSendToAria2Enabled() {
          return document.getElementById('send_to_aria2_manager').checked;
      }
  
      // Add event listener for the new button
      document.getElementById('hrefs').addEventListener('click', function(event) {
          if (event.target && event.target.getAttribute('data-id') === 'send-aria2') {
              const entry = event.target.closest('.entry');
              const link = entry.querySelector('[data-id="href"]').innerText;
              const nameElement = entry.querySelector('[data-id="name"]');
              const extElement = entry.querySelector('[data-id="ext"]');
              const filename = nameElement.innerText + '.' + extElement.innerText;
              if (isSendToAria2Enabled()) {
                  sendToAria2(link, filename);
              }
          }
      });
  
      // Add event listener for the "Send to Aria2-Manager" button
      document.getElementById('send-aria2-manager').addEventListener('click', function() {
          const links = document.querySelectorAll('.entry [data-id="href"]');
          links.forEach(link => {
              const entry = link.closest('.entry');
              const nameElement = entry.querySelector('[data-id="name"]');
              const extElement = entry.querySelector('[data-id="ext"]');
              const filename = nameElement.innerText + '.' + extElement.innerText;
              if (isSendToAria2Enabled()) {
                  sendToAria2(link.innerText, filename);
              }
          });
      });
  });
  
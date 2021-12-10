chrome.runtime.onInstalled.addListener(() => {
    console.log('This extension is running now!');
      
  chrome.storage.sync.set({sunday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({monday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({tuesday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({wednesday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({thursday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({friday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({saturday: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  chrome.storage.sync.set({total_co2: 0}, function() {
    console.log('monday is set to ' + 0);
  });
  });
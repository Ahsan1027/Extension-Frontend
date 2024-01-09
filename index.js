document.addEventListener('DOMContentLoaded', function () {
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const friendTableBody = document.querySelector('#friendTable tbody');
  const friendCountElement = document.getElementById('friendCount');

  function displayFriendsData(data) {
    for (let i = 0; i < data.length; i += 2) {
      const row = friendTableBody.insertRow();

      const firstFriend = data[i];
      const firstFriendNameCell = row.insertCell(0);
      const firstFriendNameElement = document.createElement('h3');
      firstFriendNameElement.textContent = firstFriend.name;
      firstFriendNameElement.style.width = '150px';
      firstFriendNameCell.appendChild(firstFriendNameElement);

      const firstFriendImgCell = row.insertCell(1);
      const firstFriendImgElement = document.createElement('img');
      firstFriendImgElement.src = firstFriend.imgSrc;
      firstFriendImgElement.alt = firstFriend.name;
      firstFriendImgCell.appendChild(firstFriendImgElement);

      const anchor = document.createElement('a');
      anchor.name = `row${i}`;
      row.appendChild(anchor);

      if (i + 1 < data.length) {
        const secondFriend = data[i + 1];
        const secondFriendNameCell = row.insertCell(2);
        const secondFriendNameElement = document.createElement('h3');
        secondFriendNameElement.textContent = secondFriend.name;
        secondFriendNameElement.style.width = '150px';
        secondFriendNameElement.style.marginLeft = '200px';
        secondFriendNameCell.appendChild(secondFriendNameElement);

        const secondFriendImgCell = row.insertCell(3);
        const secondFriendImgElement = document.createElement('img');
        secondFriendImgElement.src = secondFriend.imgSrc;
        secondFriendImgElement.alt = secondFriend.name;
        secondFriendImgCell.appendChild(secondFriendImgElement);

        const secondAnchor = document.createElement('a');
        secondAnchor.name = `row${i + 1}`;
        row.appendChild(secondAnchor);
      }
    }

    const lastAnchor = friendTableBody.querySelector(`a[name="row${data.length - 1}"]`);
    if (lastAnchor) {
      lastAnchor.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
    }

    friendCountElement.textContent = data.length;
  }



  sendMessageBtn.addEventListener('click', function () {
    sendMessageBtn.style.display = 'none';
    fetchDataAndDisplay();
    setInterval(fetchDataAndDisplay, 2000);
  });

  function fetchDataAndDisplay() {
    const extensionId = 'ghijhhpadnkokleedhdfapmmmghdbbkl';

    chrome.runtime.sendMessage(extensionId, { action: 'triggerFromWebApp' }, function (response) {
      if (response && response.success && response.data && response.data.length > 0) {
        console.log('Received data from extension:', response.data);

        fetch('http://localhost:3003/api/scrape-friends/add-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(response.data)
        })
          .then(response => response.json())
          .then(data => {
            console.log('Response from API:', data);

            friendTableBody.innerHTML = '';

            fetch('http://localhost:3003/api/scrape-friends/get-data')
              .then(response => response.json())
              .then(data => {
                console.log('All Friends Data:', data.friends);
                displayFriendsData(data.friends);
              })
              .catch(error => {
                console.error('Error fetching all friends data:', error);
              });
          })
          .catch(error => {
            console.error('Error posting data:', error);
          });
      } else {
        console.error('Failed to get data from extension or data is empty.');
      }
    });
  }
});

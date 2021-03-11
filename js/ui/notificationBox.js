
// this is the notification box that can be used to set notification messages in the ui



/**
 * set a message to appear in the Notification box of the UI
 * @param successMsg - a string that will appear with a green background
 * @param errorMsg - a string that will display in the notification box with a red background
 * @param infoMsg - a string that will appear in the default grey background
 */
export const setNotificationMessage = (successMsg, errorMsg, infoMsg) => {
    const notificationBox = document.getElementById("notification-box");
    const messageContainer = document.querySelector('.message-container');

    if (successMsg) {
        notificationBox.className = 'notification is-success';
        messageContainer.textContent = successMsg;
    } else if (errorMsg) {
        notificationBox.className = 'notification is-danger';
        messageContainer.textContent = errorMsg;
    } else {
        notificationBox.className = 'notification';
        messageContainer.textContent = infoMsg;
    }
};
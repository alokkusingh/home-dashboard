import {getEventStreamHeadersJson} from './APIUtils'
import {refreshToken} from '../utils/SessionUtils'

export async function subscribeForEventJson(eventId) {

    const sseUrl = "/home/event/" + eventId + "/subscribe?token=Bearer " + sessionStorage.getItem("ID_TOKEN");
    const eventSource = new EventSource(sseUrl);

    // Event listener for receiving messages
    eventSource.onmessage = function(event) {
        console.log('New message:', event.data);
        // You can parse the data if it's JSON
        // const data = JSON.parse(event.data);
        // console.log('Parsed data:', data);
    };

    // Event listener for custom events (if the server sends named events)
    eventSource.addEventListener('customEvent', function(event) {
        console.log('Custom event received:', event.data);
    });

    // Event listener for errors
    eventSource.onerror = function(event) {
        console.error('Error occurred:', event);
        // Optionally, you can close the connection and retry
        eventSource.close();
        console.log('Connection closed. Retrying...');
        setTimeout(() => {
            new EventSource(sseUrl);
        }, 5000); // Retry after 5 seconds
    };


//    var requestOptions = {
//      method: 'GET',
//      headers: getEventStreamHeadersJson()
//    };
//
//    try {
//    const responsePromise = await fetch('/home/event/' + eventId + '/subscribe', requestOptions);
//    if (responsePromise.status === 401) {
//      redirectToLogin();
//    }
//    if (responsePromise.status === 403) {
//      return;
//    }
//
//    // Handle errors
//    responsePromise.body.onerror = (error) => {
//        console.error('SSE error:', error);
//    };
//
//    // Get the readable stream from the response body
//    const reader = responsePromise.body.getReader();
//    const decoder = new TextDecoder();
//
//    while (true) {
//        const { value, done } = await reader.read();
//        alert("New event received");
//        if (done) break;
//        console.log("New event received:", decoder.decode(value));
//    }
//
//    } catch (error) {
//        console.error('Error subscribing to SSE:', error);
//    }
}
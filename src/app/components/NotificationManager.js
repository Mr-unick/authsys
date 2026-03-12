import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function NotificationManager() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // 1. Get current user
        axios.get('/api/auth/isauthenticated', {
            validateStatus: (status) => (status >= 200 && status < 300) || status === 401
        })
            .then(res => {
                if (res.status === 200 && res.data.status === 200) {
                    setCurrentUser(res.data.data);
                }
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error("NotificationManager auth error:", err);
                }
            });

        // 2. Request browser notification permission
        if ("Notification" in window) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        // 3. Connect to SSE for real-time notifications
        const eventSource = new EventSource('/api/activities/stream');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // 4. Check if it's a notification for the current user
                if (data.sseType === 'notification' && data.user_id === currentUser.id) {
                    showNotification(data.message);
                }
            } catch (err) {
                console.error("Error parsing SSE data:", err);
            }
        };

        eventSource.onerror = (err) => {
            console.error("SSE Connection failed, closing...");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [currentUser]);

    const showNotification = (message) => {
        // Show Toast (UI notification)
        toast.info(message, {
            position: "bottom-right",
            autoClose: 5000,
        });

        // Show Browser Popup (System notification)
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("LeadTracker Notification", {
                body: message,
                icon: "/logo.png" // Update with actual icon path if available
            });
        }
    };

    return null; // This component doesn't render anything UI-wise
}

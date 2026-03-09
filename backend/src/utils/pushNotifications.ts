/**
 * @desc    Simulate sending a push notification (Phase 8 Bonus)
 * @param   userId The ID of the user to send the notification to
 * @param   title The title of the notification
 * @param   body The body text of the notification
 */
export const sendMockPushNotification = async (userId: string, title: string, body: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
};

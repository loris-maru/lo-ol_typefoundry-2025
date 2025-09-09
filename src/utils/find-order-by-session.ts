// This function is no longer needed since we have the API route
// Keeping it for backward compatibility but it should not be used
export async function findOrderBySession(sessionId: string) {
  console.warn('findOrderBySession is deprecated. Use the /api/order-by-session API route instead.');
  return null;
}
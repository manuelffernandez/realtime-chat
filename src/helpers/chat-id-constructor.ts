// TODO: improve chatId create system
export const chatIdConstructor = (userIdOne: string, userIdTwo: string) => {
  const sortedIds = [userIdOne, userIdTwo].sort()

  return `${sortedIds[0]}--${sortedIds[1]}`
}

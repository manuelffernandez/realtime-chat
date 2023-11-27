import PusherSever from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer = new PusherSever({
  appId: process.env.PUSHER_APP_ID ?? '',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '',
  secret: process.env.PUSHER_APP_SECRET ?? '',
  cluster: 'sa1',
  useTLS: true
})

export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
  cluster: 'sa1'
})

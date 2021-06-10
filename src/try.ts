const notifier = require('node-notifier')

notifier.notify(
  {
    title: 'Title',
    subtitle: 'Subtitle',
    sound: true,
    wait: true,
  },
  (error, response, metadata) => {
    console.log(`=== Response`)
    console.log(response)
    console.log(`=== Metadata`)
    console.log(metadata)
  }
)
